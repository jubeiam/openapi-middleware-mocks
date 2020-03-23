import { isMethod, correctPath, addRoutes, generateResponse } from '../src/ConfigureRouter'
import parser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from 'openapi-types';
import Routes from "routes";
import MockData from "../src/MockData";


const mockAddRoute = jest.fn();
jest.mock('routes', () => {
    return jest.fn().mockImplementation(() => {
        return { addRoute: mockAddRoute };
    });
});


let router
let apiConfig

beforeAll(() => {
    return new Promise(resolve => {
        parser.dereference('./tests/petstore.yaml', function (err, api: OpenAPIV3.Document) {
            if (err) throw err;
            apiConfig = api
            resolve();
        });
    });
})

beforeEach(() => {
    mockAddRoute.mockClear();
    // @ts-ignore
    router = new Routes()
});

test('isMethod', () => {
    expect(isMethod('foo')).toBeFalsy()
    expect(isMethod('get')).toBeTruthy()
});

test('correctPath', () => {
    expect(correctPath('foo')).toBe('/foo')
    expect(correctPath('/foo')).toBe('/foo')
    expect(correctPath('foo/bar/')).toBe('/foo/bar')
    expect(correctPath('/foo/bar/')).toBe('/foo/bar')
    expect(correctPath('foo/{bar}/')).toBe('/foo/:bar')
    expect(correctPath('foo/{bar}')).toBe('/foo/:bar')
});


test('addRoutes', () => {
    const route = '/pets'
    const pathItemObject: OpenAPIV3.PathItemObject = apiConfig.paths[route]

    addRoutes(pathItemObject, router, route)
    expect(mockAddRoute.mock.calls[0][0]).toEqual('GET /pets');
})

test('generateResponse - 200', () => {
    const fn = jest.fn((schema: any, code: number) => { })

    generateResponse(apiConfig.paths['/pets'].get.responses, fn)

    expect(fn.mock.calls[0][1]).toEqual(200);
    expect(fn.mock.calls[0][0].description).toEqual(apiConfig.paths['/pets'].get.responses[200].description)
})

test('generateResponse - default', () => {
    const fn = jest.fn((schema: any, code: number) => { })

    generateResponse(apiConfig.paths['/pets'].head.responses, fn)

    expect(fn.mock.calls[0][1]).toEqual(400);
    expect(fn.mock.calls[0][0].description).toEqual(apiConfig.paths['/pets'].get.responses.default.description)
})


test('generateResponse - 300 to default', () => {
    const fn = jest.fn((schema: any, code: number) => { })

    generateResponse(apiConfig.paths['/pets'].options.responses, fn)

    expect(fn.mock.calls[0][1]).toEqual(400);
    expect(fn.mock.calls[0][0].description).toEqual(apiConfig.paths['/pets'].get.responses.default.description)
})
