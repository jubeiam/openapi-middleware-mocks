import path from 'path'
import { invoke } from './invoke.util'
const api = path.join(__dirname, '../', 'petstore.yaml')


test('Config ignore path with all methods', async () => {
    const response = await invoke({
        url: '/pets',
        method: 'GET'
    }, {
        openApiFile: api,
        ignorePaths: ['/pets']
    })

    expect(response.statusCode).toBe(404)
})

test('Config ignore path with specified method', async () => {
    const responsePost = await invoke({
        url: '/pets',
        method: 'POST'
    }, {
        openApiFile: api,
        ignorePaths: ['POST /pets']
    })

    const responseGet = await invoke({
        url: '/pets',
        method: 'GET'
    }, {
        openApiFile: api,
        ignorePaths: ['POST /pets']
    })

    expect(responsePost.statusCode).toBe(404)
    expect(responseGet.statusCode).toBe(200)
})

test('Config mock specified route', async () => {
    const response = await invoke({
        url: '/pets',
        method: 'GET'
    }, {
        openApiFile: api,
        mockPaths: ['/pets']
    })

    expect(response.statusCode).toBe(200)
})

test('Config mock specified route and method', async () => {
    const responsePost = await invoke({
        url: '/pets',
        method: 'POST'
    }, {
        openApiFile: api,
        mockPaths: ['POST /pets']
    })

    const responseGet = await invoke({
        url: '/pets',
        method: 'GET'
    }, {
        openApiFile: api,
        mockPaths: ['POST /pets']
    })

    expect(responsePost.statusCode).toBe(201)
    expect(responseGet.statusCode).toBe(404)
})

test('Config cant specify mockPaths and ignorePaths', async () => {
    invoke({
        url: '/pets',
        method: 'POST'
    }, {
        openApiFile: api,
        mockPaths: ['POST /pets'],
        ignorePaths: []
    }).catch((e) => {
        expect(e).toBeInstanceOf(Error)
    })
})