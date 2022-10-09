import { correctPath, addRoutes } from '../../src/ConfigureRouter'
import parser from '@apidevtools/swagger-parser'
import { OpenAPIV3 } from 'openapi-types'
import Routes from 'routes'

const mockAddRoute = jest.fn()
jest.mock('routes', () => {
    return jest.fn().mockImplementation(() => {
        return { addRoute: mockAddRoute }
    })
})

let router
let apiConfig

beforeAll(() => {
    return new Promise((resolve) => {
        parser.dereference('./tests/petstore.yaml', function (err, api) {
            if (err) throw err
            apiConfig = api
            resolve(undefined)
        })
    })
})

beforeEach(() => {
    mockAddRoute.mockClear()
    router = new Routes()
})

test('correctPath', () => {
    expect(correctPath('foo')).toBe('/foo')
    expect(correctPath('/foo')).toBe('/foo')
    expect(correctPath('foo/bar/')).toBe('/foo/bar')
    expect(correctPath('/foo/bar/')).toBe('/foo/bar')
    expect(correctPath('foo/{bar}/')).toBe('/foo/:bar')
    expect(correctPath('foo/{bar}')).toBe('/foo/:bar')
})

test('addRoutes', () => {
    const route = '/pets'
    const pathItemObject: OpenAPIV3.PathItemObject = apiConfig.paths[route]

    addRoutes(pathItemObject, router, route)
    expect(mockAddRoute.mock.calls[0][0]).toEqual('GET /pets')
})
