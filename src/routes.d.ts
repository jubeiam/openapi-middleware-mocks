type P = {
    [key: string]: string
}

type route = {
    params: P
    splats: any[]
    route: string
    fn: Function
    next: Function
}

declare module 'routes' {
    export default class Routes {
        constructor()
        match(route: string): route
        addRoute(route: string, fn: Function): void
    }
}
