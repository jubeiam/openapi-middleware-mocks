import main, { Config } from '../../src/index'

interface LocalRequest {
    method: 'GET' | 'POST' | 'PUT'
    url: string
    body?: any
    headers?: any
}

interface LocalResponse {
    statusCode: number
    body: any
}


let cachedMain = null;
let caheKey = ''

async function getMiddleware(mainConfig: Config) {
    if (caheKey === JSON.stringify(mainConfig)) {
        return cachedMain
    }

    caheKey = JSON.stringify(mainConfig);
    return cachedMain = await main({
        format400() {
            return {
                code: 400,
                message: 'bad request',
            }
        },
        format404() {
            return {
                code: 404,
                message: 'not found'
            }
        },
        ...mainConfig
    })
}

export async function invoke(request: LocalRequest, mainConfig: Config = {}): Promise<LocalResponse> {

    const execRoute = await getMiddleware(mainConfig)

    const res = {
        statusCode: 0,
        response: null,
        write(x) {
            this.response = x
            if (x) {
                this.response = JSON.parse(x);
            }
        },
        end() { },
        setHeader() { },
        status(code: number) {
            this.statusCode = code
        }
    }

    const next = () => {
        console.log('NOT FOUND', request.url);
    }

    await execRoute(request, res, next)

    return <LocalResponse>{
        statusCode: res.statusCode,
        body: res.response,
    }
}