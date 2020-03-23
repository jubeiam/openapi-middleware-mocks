import url from "url";
import parser from "@apidevtools/swagger-parser";
import ConfigureRouter from "./ConfigureRouter";
import PrunePaths from "./PrunePaths";
import Routes from 'routes';
import { OpenAPIV3 } from 'openapi-types'

export interface Config {
  swaggerFile: string;
  ignorePaths: string[];
  mockPaths: string[];
  watch: boolean;
}

export default function (config: Config) {
  if (!config.swaggerFile) {
    throw new Error("Config is missing `swaggerFile` parameter");
  }

  if (config.ignorePaths && config.mockPaths) {
    throw new Error("Cannot specify both ignorePaths and mockPaths in config");
  }

  let basePath = "";
  let router: Routes;

  let parserPromise = new Promise(resolve => {
    parser.dereference(config.swaggerFile, function (err, api: OpenAPIV3.Document) {
      if (err) throw err;

      init(api);
      resolve();
    });
  });

  function init(api: OpenAPIV3.Document) {
    if (config.ignorePaths) {
      api.paths = PrunePaths(api.paths, config.ignorePaths);
    } else if (config.mockPaths) {
      api.paths = PrunePaths(api.paths, config.mockPaths, true);
    }

    router = ConfigureRouter(api.paths);
  }

  /**
   * Middleware
   */
  return function (req: any, res: any, next: any) {
    parserPromise.then(() => {
      const method = req.method.toLowerCase();

      let path = url.parse(req.url).pathname;
      path = path.replace(basePath + "/", "");
      if (path.charAt(0) !== "/") {
        path = "/" + path;
      }

      const matchingRoute = router.match("/" + method + path);

      if (!matchingRoute) return next();

      if (process.env.debug) {
        console.log("Request: %s %s", req.method, path);
      }

      try {
        const response = matchingRoute.fn();
        res.setHeader("Content-Type", "application/json");
        res.write(response !== null ? JSON.stringify(response) : "");
      } catch (e) {
        res.statusCode = 500;
        res.write(JSON.stringify({ message: e.message }, null, 4));
      }

      res.end();
    });
  };
}
