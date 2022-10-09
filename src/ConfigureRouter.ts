import Routes from 'routes'
import prepareResponse, { RouteData } from './PrepareResponse'
import { OpenAPIV3 } from 'openapi-types'

export function correctPath(path: string) {
    const uri = path.replace(/^\/?|\/?$/g, '')
    const segments = uri.split('/')

    return (
        '/' +
        segments
            .map((segment) => {
                if (segment.charAt(0) === '{' && segment.charAt(segment.length - 1) === '}') {
                    return ':' + segment.slice(1, -1)
                }

                return segment
            })
            .join('/')
    )
}

export function addRoutes(pathItemObject: OpenAPIV3.PathItemObject, router: Routes, route: string) {
    pathItemObject.get && router.addRoute(`GET ${route}`, prepareResponse(pathItemObject.get))
    pathItemObject.put && router.addRoute(`PUT ${route}`, prepareResponse(pathItemObject.put))
    pathItemObject.post && router.addRoute(`POST ${route}`, prepareResponse(pathItemObject.post))
    pathItemObject.delete &&
        router.addRoute(`DELETE ${route}`, prepareResponse(pathItemObject.delete))
    pathItemObject.options &&
        router.addRoute(`OPTIONS ${route}`, prepareResponse(pathItemObject.options))
    pathItemObject.head && router.addRoute(`HEAD ${route}`, prepareResponse(pathItemObject.head))
    pathItemObject.patch && router.addRoute(`PATCH ${route}`, prepareResponse(pathItemObject.patch))
}

export default function ConfigureRouter(paths: OpenAPIV3.PathsObject): Routes {
    const router = new Routes()

    for (let path in paths) {
        if (!paths.hasOwnProperty(path)) continue

        const pathItemObject = paths[path]
        const route = correctPath(path)

        addRoutes(pathItemObject, router, route)
    }

    return router
}
