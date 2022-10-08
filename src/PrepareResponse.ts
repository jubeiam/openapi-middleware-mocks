import { set } from 'lodash'
import Parser, { ParserSchemaObject } from './Parsers/Parser'
import { OpenAPIV3 } from 'openapi-types'

const castToJsonSchema = require('@openapi-contrib/openapi-schema-to-json-schema')
const djv = require('djv')
const parser = new Parser()

export function validateDataAgainstSchema(
    data: any,
    schema: ParserSchemaObject
): true | string {
    const env = djv({
        version: 'draft-04',
    })
    const jsonSchema = castToJsonSchema(schema)
    env.addSchema('v', jsonSchema)

    const valid = env.validate('v', data)
    if (undefined !== valid) {
        return `${valid.keyword} in ${valid.dataPath}`
    }

    return true
}

export interface RouteData {
    body: any
    method: string
    params: string[]
    overrides: any
}

function getRequestBodySchema(requestBody: OpenAPIV3.RequestBodyObject) {
    return <any>requestBody?.content?.['application/json']?.schema
}

function getResponseSchema(
    responseCode: string,
    responses: OpenAPIV3.ResponsesObject
) {
    const r = <OpenAPIV3.ResponseObject>(
        (responses[responseCode] || responses['default'])
    )
    return <any>r?.content?.['application/json']?.schema
}

function validateRequestBody(operation: OpenAPIV3.OperationObject, data: any) {
    let responseSchema, responseCode, responseBody

    if (operation.requestBody && 'content' in operation.requestBody) {
        const requestBodySchema = <ParserSchemaObject>(
            getRequestBodySchema(operation.requestBody)
        )
        let validRequestBody: true | string = 'schema missing'
        if (requestBodySchema) {
            validRequestBody = validateDataAgainstSchema(
                data,
                requestBodySchema
            )
        }

        if (true !== validRequestBody) {
            responseCode = '400'
            responseBody = responseSchema = <ParserSchemaObject>(
                getResponseSchema(responseCode, operation.responses)
            )

            if (responseSchema) {
                responseBody = parser.parse(responseSchema)
            }

            return [responseBody, responseCode]
        }
    }

    return null
}

function applyOverride(config: any, what: any) {
    Object.entries(config).forEach((entry: any) => {
        set(what, entry[0], entry[1])
    })

    return what
}

export default function prepareResponse(operation: OpenAPIV3.OperationObject) {
    return (routeData: RouteData) => {
        const responses = operation.responses
        let responseCode = '500'
        let responseBody = null
        const headers = new Map()

        if (routeData.body) {
            const resultRequest = validateRequestBody(operation, routeData.body)
            if (resultRequest) {
                return [resultRequest[0], parseInt(resultRequest[1])]
            }
        }

        for (responseCode in responses) {
            const responseCodeInt = parseInt(responseCode)

            if (199 < responseCodeInt && responseCodeInt < 300) {
                if ('content' in responses[responseCode]) {
                    const responseSchema = getResponseSchema(
                        responseCode,
                        responses
                    )

                    responseBody = parser.parse(responseSchema)
                    console.log(responseBody)

                    responseBody = applyOverride(
                        routeData.overrides,
                        responseBody
                    )

                    if ('headers' in responses[responseCode]) {
                        const responseHeaders = (<OpenAPIV3.ResponseObject>(
                            responses[responseCode]
                        )).headers

                        for (const k in responseHeaders) {
                            headers.set(
                                k,
                                parser.parse(
                                    <ParserSchemaObject>(
                                        (<OpenAPIV3.HeaderObject>(
                                            responseHeaders[k]
                                        )).schema
                                    )
                                )
                            )
                        }
                    }
                }

                break
            }
        }

        if (responseBody === undefined) {
            responseCode = '500'
            responseBody = getResponseSchema('default', responses)
            responseBody = parser.parse(responseBody)
        }

        return [responseBody, parseInt(responseCode), headers]
    }
}
