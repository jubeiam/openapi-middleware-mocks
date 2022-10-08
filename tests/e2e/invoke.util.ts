import main, { Config } from '../../src/index'

type headers = {
    [key: string]: string | number
}

interface LocalRequest {
    method: 'GET' | 'POST' | 'PUT'
    url: string
    body?: any
    headers?: headers
}

interface LocalResponse {
    statusCode: number
    body: any
    headers?: headers
}

let cachedMain
let caheKey: string

async function getMiddleware(mainConfig: Config) {
    if (caheKey === JSON.stringify(mainConfig)) {
        return cachedMain
    }

    caheKey = JSON.stringify(mainConfig)
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
        },
        end() {},
        setHeader(key: string, value: string): void {
            if (!this.headers) {
                this.headers = {}
            }
            this.headers[key] = value
        },
        status(code: number) {
            this.statusCode = code
        },
    }

    const next = () => {
        console.log('NOT FOUND', request.url)
    }

    await execRoute(request, res, next)

    return <LocalResponse>{
        statusCode: res.statusCode,
        body: res.response,
        headers: res.headers,
    }
}
