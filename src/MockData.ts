import Parser, { ParserSchemaObject } from './Parsers/Parser'
import { OpenAPIV3 } from 'openapi-types'

const parser = new Parser()

export default function MockData(definition: OpenAPIV3.ResponseObject, responseCode: number) {
    const def = (definition.content || {})['application/json']

    if (!def) {
        return [null, responseCode]
    }

    if (!def.schema) {
        if (process.env.debug) {
            console.warn('Schema not found')
        }

        return [null, 500]
    }

    return [parser.parse(<ParserSchemaObject>def.schema), responseCode]
}
