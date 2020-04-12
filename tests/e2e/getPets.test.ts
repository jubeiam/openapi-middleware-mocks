import path from 'path'
import { invoke } from './invoke.util'
import { OpenAPIV3 } from 'openapi-types'
const api = path.join(__dirname, '../', 'petstore.yaml')


test('Get pets list', async () => {
    const response = await invoke(api, {
        url: '/pets',
        method: 'GET'
    })
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()
})

test('Get Pet by id', async () => {
    const response = await invoke(api, {
        url: '/pets/1',
        method: 'GET'
    })

    expect(response.statusCode).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.name).toBeDefined()
    expect(response.body.tag).toBeDefined()
})

test('Get invalid route', async () => {
    const response = await invoke(api, {
        url: '/pet',
        method: 'GET'
    })

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBeDefined()
    expect(response.body.message).toEqual('not found')
})

test('Get malformat route', async () => {
    const response = await invoke(api, {
        url: 'pets',
        method: 'GET'
    })

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBeDefined()
    expect(response.body.message).toEqual('not found')
})

test('Add new Pet - bad request', async () => {
    const response = await invoke(api, {
        url: '/pets',
        method: 'POST',
        body: {
            foo: 'bar'
        }
    })

    expect(response.statusCode).toBe(400)
    expect(response.body.code).toBe(400)
    expect(response.body.message).toBe('bad request')
})

test('Add new Pet - with valid data', async () => {
    const response = await invoke(api, {
        url: '/pets',
        method: 'POST',
        body: {
            id: 1,
            name: 'bar'
        }
    })

    expect(response.statusCode).toBe(201)
})

