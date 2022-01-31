import path from 'path'
import { invoke } from './invoke.util'
const api = path.join(__dirname, '../', 'petstore.yaml')


test('Get pets list', async () => {
    const response = await invoke({
        url: '/pets',
        method: 'GET'
    }, {
        openApiFile: api,
    })
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()
})

test('Get Pet by id', async () => {
    const response = await invoke({
        url: '/pets/1',
        method: 'GET'
    }, {
        openApiFile: api,
    })

    expect(response.statusCode).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.name).toBeDefined()
    expect(response.body.tag).toBeDefined()
})

test('Get invalid route', async () => {
    const response = await invoke({
        url: '/pet',
        method: 'GET'
    }, {
        openApiFile: api,
    })

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBeDefined()
    expect(response.body.message).toEqual('not found')
})

test('Get malformed route', async () => {
    const response = await invoke({
        url: 'pets',
        method: 'GET'
    }, {
        openApiFile: api,
    })

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBeDefined()
    expect(response.body.message).toEqual('not found')
})

test('Add new Pet - bad request', async () => {
    const response = await invoke({
        url: '/pets',
        method: 'POST',
        body: {
            foo: 'bar'
        }
    }, {
        openApiFile: api,
    })

    expect(response.statusCode).toBe(400)
    expect(response.body.code).toBe(400)
    expect(response.body.message).toBe('bad request')
})

test('Add new Pet - with valid data', async () => {
    const response = await invoke({
        url: '/pets',
        method: 'POST',
        body: {
            id: 1,
            name: 'bar'
        }
    }, {
        openApiFile: api,
    })

    expect(response.statusCode).toBe(201)
})


test('Get random pet', async () => {
    const response = await invoke({
        url: '/random-pet',
        method: 'GET'
    }, {
        openApiFile: api,
    })

    expect(response.statusCode).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.name).toBeDefined()
    expect(response.body.tag).toBeDefined()
})


test('Force mock valid property', async () => {
    const response = await invoke({
        url: '/pets/1',
        method: 'GET',
        headers: {
            'x-force-mock': '{"name": "Burek"}'
        }
    }, {
        openApiFile: api,
    })

    expect(response.statusCode).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.name).toEqual('Burek')
    expect(response.body.tag).toBeDefined()
})

test('Force mock invalid property', async () => {
    const response = await invoke({
        url: '/pets/1',
        method: 'GET',
        headers: {
            'x-force-mock': '{"name1": "Burek"}'
        }
    }, {
        openApiFile: api,
    })

    expect(response.statusCode).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.name).toBeDefined()
    expect(response.body.name1).toBeDefined()
    expect(response.body.tag).toBeDefined()
})


test('Force mock malformed', async () => {
    const response = await invoke({
        url: '/pets/1',
        method: 'GET',
        headers: {
            'x-force-mock': 'e1": "Burek"}'
        }
    }, {
        openApiFile: api,
    })

    expect(response.statusCode).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.name).toBeDefined()
    expect(response.body.tag).toBeDefined()
})