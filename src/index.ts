import parser from '@apidevtools/swagger-parser'
import ConfigureRouter from './ConfigureRouter'
import PrunePaths from './PrunePaths'
import Routes from 'routes'
import { OpenAPIV3 } from 'openapi-types'

export interface Config {
    openApiFile?: string
    openApi?: OpenAPIV3.Document
    ignorePaths?: string[]
    mockPaths?: string[]
    format400?: () => {}
    format404?: () => {}
}

export default async function (config: Config) {
    if (!config.openApiFile && !config.openApi) {
        throw new Error('Config is missing `openApiDocument` parameter')
    }

    if (config.ignorePaths && config.mockPaths) {
        throw new Error('Cannot specify both ignorePaths and mockPaths in config')
    }

    let router: Routes

    const api = <OpenAPIV3.Document>await parser.dereference(config.openApiFile || config.openApi)
    if (config.ignorePaths) {
        api.paths = PrunePaths(api.paths, config.ignorePaths)
    } else if (config.mockPaths) {
        api.paths = PrunePaths(api.paths, config.mockPaths, true)
    }

    router = ConfigureRouter(api.paths)

    /**
     * Middleware
     */
    return function (req: any, res: any, next: any) {
        const method = req.method
        const path = req.path
        const route = method.toUpperCase() + ' ' + path
        const matchingRoute = router.match(route)

        res.setHeader('Content-Type', 'application/json')

        if (!matchingRoute && config.format404) {
            return res.status(404).send(config.format404())
        } else if (!matchingRoute) {
            return next()
        }

        if (process.env.debug) {
            console.log('Request: %s %s', req.method, path)
        }

        let overrides = {}
        try {
            overrides = JSON.parse(
                Array.isArray(req.headers['x-force-mock'])
                    ? req.headers['x-force-mock'][0]
                    : req.headers['x-force-mock']
            )
        } catch (err) {}

        try {
            const response = matchingRoute.fn({
                body: req.body,
                method: req.method,
                params: req.params,
                overrides,
            })

            let body = response[0]
            res.statusCode = response[1]
            const headers = response[2]

            if (config.format400 && 400 === res.statusCode) {
                body = config.format400()
            }

            if (res.statusCode >= 200 && res.statusCode < 300 && headers) {
                headers.forEach((value: string | number, key: string) => {
                    res.setHeader(key.toLowerCase(), value)
                })
            }

            res.write(body !== null ? JSON.stringify(body) : '')
        } catch (e) {
            res.statusCode = 500
            res.write(JSON.stringify({ message: e.message }, null, 4))
            if (process.env.debug) {
            }
            console.error(e)
        }

        res.end()
    }
}
