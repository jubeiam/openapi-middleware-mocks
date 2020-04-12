import url from "url";
import parser from "@apidevtools/swagger-parser";
import ConfigureRouter from "./ConfigureRouter";
import PrunePaths from "./PrunePaths";
import Routes from 'routes';
import { OpenAPIV3 } from 'openapi-types'
import { RouteData } from './PrepareResponse'

export interface Config {
  openApiFile?: string;
  openApi?: OpenAPIV3.Document;
  ignorePaths?: string[];
  mockPaths?: string[];
  watch?: boolean;
  format400?: () => {};
  format404?: (next: Function) => {};

}

export default async function (config: Config) {
  if (!config.openApiFile && !config.openApi) {
    throw new Error("Config is missing `openApiDocument` parameter");
  }

  if (config.ignorePaths && config.mockPaths) {
    throw new Error("Cannot specify both ignorePaths and mockPaths in config");
  }

  let router: Routes;

  const api = <OpenAPIV3.Document>await parser.dereference(config.openApiFile || config.openApi);
  if (config.ignorePaths) {
    api.paths = PrunePaths(api.paths, config.ignorePaths);
  } else if (config.mockPaths) {
    api.paths = PrunePaths(api.paths, config.mockPaths, true);
  }

  router = ConfigureRouter(api.paths);

  /**
   * Middleware
   */
  return function (req: any, res: any, next: any) {
    const method = req.method;
    const path = url.parse(req.url).pathname;
    const route = method.toUpperCase() + ' ' + path;
    const matchingRoute = router.match(route);
    let body

    res.setHeader("Content-Type", "application/json");

    if (!matchingRoute && config.format404) {
      res.statusCode = 404;
      res.write(JSON.stringify(config.format404(next)));
      return;
    } else if (!matchingRoute) {
      return next();
    }

    if (process.env.debug) {
      console.log("Request: %s %s", req.method, path);
    }

    try {
      const response = matchingRoute.fn(<RouteData>{
        body: req.body,
        method: req.method,
        params: req.params
      });
      let body = response[0]
      const statusCode = response[1]

      res.statusCode = statusCode;

      if (config.format400 && 400 === res.statusCode) {
        body = config.format400()
      }

      res.write(body !== null ? JSON.stringify(body) : "");
    } catch (e) {
      res.statusCode = 500;
      res.write(JSON.stringify({ message: e.message }, null, 4));
      if (process.env.debug) { }
      console.error(e)
    }

    res.end();
  };
}
