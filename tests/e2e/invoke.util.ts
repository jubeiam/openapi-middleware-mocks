import main from '../../src/index'

interface LocalRequest {
    method: 'GET' | 'POST' | 'PUT'
    url: string
    body?: any
}

interface LocalResponse {
    statusCode: number
    body: any
}


let cachedMain = null;
let caheKey = ''

async function getMiddleware(api: string) {
    if (caheKey === api) {
        return cachedMain
    }

    caheKey = api;
    return cachedMain = await main({
        openApiFile: api,
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
        }
    })
}

export async function invoke(api: string, request: LocalRequest): Promise<LocalResponse> {

    const execRoute = await getMiddleware(api)

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