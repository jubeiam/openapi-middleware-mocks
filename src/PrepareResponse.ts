import Parser from "./Parsers/Parser";
import { OpenAPIV3 } from "openapi-types";

const castToJsonSchema = require('@openapi-contrib/openapi-schema-to-json-schema');
const djv = require('djv');
const parser = new Parser();


export function validateDataAgainstSchema(data: any, schema: OpenAPIV3.BaseSchemaObject): true | string {
    const env = djv({
        version: 'draft-04'
    })
    const jsonSchema = castToJsonSchema(schema)
    env.addSchema('v', jsonSchema)

    const valid = env.validate('v', data);
    if (undefined !== valid) {
        return `${valid.keyword} in ${valid.dataPath}`;
    }

    return true
}

export interface RouteData {
    body: any
    params: string[]
    method: string
    baseUrl: string
    url: string
}

function getRequestBodySchema(requestBody: OpenAPIV3.RequestBodyObject) {
    return <any>requestBody?.content?.['application/json']?.schema
}

function getResponseSchema(responseCode: string, responses: OpenAPIV3.ResponsesObject) {
    const r = <OpenAPIV3.ResponseObject>(responses[responseCode] || responses['default'])
    return <any>r?.content?.['application/json']?.schema
}

function validateRequestBody(operation: OpenAPIV3.OperationObject, data: any) {
    let responseSchema, responseCode, responseBody

    if (operation.requestBody && 'content' in operation.requestBody) {
        const requestBodySchema = <OpenAPIV3.BaseSchemaObject>getRequestBodySchema(operation.requestBody)
        let validRequestBody: true | string = 'schema missing'
        if (requestBodySchema) {
            validRequestBody = validateDataAgainstSchema(data, requestBodySchema)
        }

        if (true !== validRequestBody) {
            responseCode = '400'
            responseBody = responseSchema = <OpenAPIV3.BaseSchemaObject>getResponseSchema(responseCode, operation.responses)

            if (responseSchema) {
                responseBody = parser.parse(responseSchema)
            }

            return [responseBody, responseCode]
        }
    }

    return null
}

export default function PrepareResponse(operation: OpenAPIV3.OperationObject) {

    return (routeData: RouteData, next: Function) => {
        const responses = operation.responses
        let responseCode = '500', responseBody = null

        const resultRequest = validateRequestBody(operation, routeData.body)
        if (resultRequest) {
            return [resultRequest[0], parseInt(resultRequest[1])]
        }

        for (responseCode in responses) {
            const responseCodeInt = parseInt(responseCode)

            if (199 < responseCodeInt && responseCodeInt < 300) {
                if ('content' in responses[responseCode]) {
                    responseBody = getResponseSchema(responseCode, responses)
                    responseBody = parser.parse(responseBody)
                }

                break
            }
        }

        if (responseBody === undefined) {
            responseCode = '500'
            responseBody = getResponseSchema('default', responses)
            responseBody = parser.parse(responseBody)
        }

        return [responseBody, parseInt(responseCode)]
    }
}