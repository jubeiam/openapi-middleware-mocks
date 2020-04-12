import parser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from 'openapi-types'
import ConfigureRouter, { correctPath } from '../../src/ConfigureRouter';
import { RouteData } from '../../src/PrepareResponse'

interface LocalRequest {
    method: 'GET' | 'POST' | 'PUT'
    url: string
    body?: any
}

interface LocalResponse {
    statusCode: number
    body: any
}

export async function invoke(api: string | OpenAPIV3.Document, request: LocalRequest): Promise<LocalResponse> {
    const apiDef = await parser.dereference(api)
    const router = ConfigureRouter(apiDef.paths);


    // TODO: extract to src
    function format500Message(message: 'internal server error'): Object {
        return { code: 500, message }
    }

    function format404Message(): Object {
        return { code: 404, message: 'not found' }
    }

    function format400Message(): Object {
        return { code: 400, message: 'bad request' }
    }

    const matchingRoute = router.match(request.method.toUpperCase() + ' ' + request.url);

    let response, statusCode

    if (!matchingRoute) {
        return <LocalResponse>{
            statusCode: 404,
            body: format404Message()
        }
    }

    const matchingRouteData = <RouteData>{
        body: request.body,
        params: matchingRoute.params,
        method: request.method,
        baseUrl: request.url,
        url: request.url,
    }

    try {
        [response, statusCode] = matchingRoute.fn(matchingRouteData, matchingRoute.next);
    } catch (e) {
        statusCode = 500
        response = format500Message(e.message)
        console.error(e)
    }

    if (400 === statusCode) {
        response = format400Message()
    }

    return <LocalResponse>{
        statusCode: statusCode,
        body: response,
    }
}