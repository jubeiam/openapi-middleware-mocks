import { validateDataAgainstSchema } from '../../src/PrepareResponse'
import { OpenAPIV3 } from "openapi-types";


const schema = <OpenAPIV3.BaseSchemaObject>{
    type: 'object',
    required: ['name'],
    properties: {
        name: {
            type: 'string'
        },
        tag: {
            type: 'string'
        }
    }
}

test('Empty request body', () => {
    const valid = validateDataAgainstSchema('', schema)
    expect(typeof valid).toEqual('string')
})

test('Invalid request body', () => {
    const valid = validateDataAgainstSchema({ name: 1 }, schema)
    expect(typeof valid).toEqual('string')
})

test('Missing required params in request body', () => {
    const valid = validateDataAgainstSchema({ tag: '1' }, schema)
    expect(typeof valid).toEqual('string')
})

test('Valid request body', () => {
    const valid = validateDataAgainstSchema({ name: '1' }, schema)
    expect(valid).toEqual(true)
})
