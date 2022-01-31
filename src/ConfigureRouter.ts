import Routes from "routes";
import prepareResponse from "./PrepareResponse";
import { OpenAPIV3 } from "openapi-types";

export function isMethod(name: string): boolean {
    return ["get", "put", "post", "delete", "options", "head", "patch"].includes(
        name
    );
}

export function correctPath(path: string) {
    const uri = path.replace(/^\/?|\/?$/g, "");
    const segments = uri.split("/");

    return (
        "/" +
        segments
            .map(segment => {
                if (
                    segment.charAt(0) === "{" &&
                    segment.charAt(segment.length - 1) === "}"
                ) {
                    return ":" + segment.slice(1, -1);
                }

                return segment;
            })
            .join("/")
    );
}

export function addRoutes(pathItemObject: OpenAPIV3.PathItemObject, router: Routes, route: string) {
    for (let methodName in pathItemObject) {
        if (!isMethod(methodName)) continue;

        if (process.env.debug) {
            console.log("ADDING ROUTE: ", methodName.toUpperCase() + ' ' + route);
        }

        // @ts-ignore
        const respond = prepareResponse(pathItemObject[methodName]);
        router.addRoute(methodName.toUpperCase() + ' ' + route, respond);
    }
}

export default function ConfigureRouter(paths: OpenAPIV3.PathsObject): Routes {
    const router = new Routes();

    for (let path in paths) {
        if (!paths.hasOwnProperty(path)) continue;

        const pathItemObject = paths[path];
        const route = correctPath(path);

        addRoutes(pathItemObject, router, route)
    }

    return router;
}
