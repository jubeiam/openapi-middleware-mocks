import Routes from "routes";
import MockData from "./MockData";

function correctPath(path: string) {
    let uri = path.replace(/^\/?|\/?$/, "");
    let segments = uri.split("/");

    return (
        "/" +
        segments
            .map(s => {
                let segment = s;
                if (
                    segment.charAt(0) === "{" &&
                    segment.charAt(segment.length - 1) === "}"
                ) {
                    segment = segment.slice(1, -1);
                    return ":" + segment;
                }

                return segment;
            })
            .join("/")
    );
}

function generateResponse(potentialResponses: any) {
    for (let k in potentialResponses) {
        if (k === "default") continue;

        let responseSchema = potentialResponses[k];
        let responseCode = parseInt(k, 10);
        if (responseCode > 199 && responseCode < 300) {
            return MockData.bind(null, responseSchema);
        }
    }

    if (potentialResponses.default) {
        return MockData.bind(null, potentialResponses.default);
    }
}

export default function ConfigureRouter(paths: any): Routes {
    let router = new Routes();

    for (let pk in paths) {
        if (!paths.hasOwnProperty(pk)) continue;

        let path = paths[pk];
        let route = correctPath(pk);

        for (let mk in path) {
            if (!path.hasOwnProperty(mk)) continue;

            let method = path[mk];

            if (process.env.debug) {
                console.log("ADDING ROUTE: ", mk.toUpperCase() + " " + pk);
            }

            let respond = generateResponse(method.responses);
            router.addRoute("/" + mk + route, respond);
        }
    }

    return router;
}
