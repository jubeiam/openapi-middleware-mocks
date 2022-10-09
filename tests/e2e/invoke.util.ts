import main, { Config } from '../../src/index'

type headers = {
    [key: string]: string | number
}

interface LocalRequest {
    method: 'GET' | 'POST' | 'PUT'
    path: string
    body?: any
    headers?: headers
}

interface LocalResponse {
    statusCode: number
    body: any
    headers?: headers
}

let cachedMain
let cacheKey: string

async function getMiddleware(mainConfig: Config) {
    if (cacheKey === JSON.stringify(mainConfig)) {
        return cachedMain
    }

    cacheKey = JSON.stringify(mainConfig)
    return (cachedMain = await main({
        format400() {
            return {
                code: 400,
                message: 'bad request',
            }
        },
        format404() {
            return {
                code: 404,
                message: 'not found',
            }
        },
        ...mainConfig,
    }))
}

export async function invoke(
    request: LocalRequest,
    mainConfig: Config = {}
): Promise<LocalResponse> {
    const execRoute = await getMiddleware(mainConfig)

    const res = {
        statusCode: 0,
        response: null,
        headers: undefined,
        write(x) {
            this.response = x
            if (x) {
                this.response = JSON.parse(x)
            }

            return this
        },
        send(x) {
            this.response = x

            return this
        },
        end() {},
        setHeader(key: string, value: string): void {
            if (!this.headers) {
                this.headers = {}
            }
            this.headers[key] = value

            return this
        },
        status(code: number) {
            this.statusCode = code

            return this
        },
    }

    const next = () => {
        console.log('NOT FOUND', request.path)
    }

    await execRoute(request, res, next)

    return <LocalResponse>{
        statusCode: res.statusCode,
        body: res.response,
        headers: res.headers,
    }
}
