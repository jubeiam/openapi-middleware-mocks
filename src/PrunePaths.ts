import { OpenAPIV3 } from 'openapi-types'

type Methods = 'get' | 'post' | 'delete' | 'put'

export default function PrunePaths(paths: OpenAPIV3.PathsObject, passthroughPaths: string[], keep = false) {
  const replacement: any = {};

  for (let i = 0; i < passthroughPaths.length; i++) {
    const p = passthroughPaths[i];
    const [path, ...methods] = p.split(" ").reverse();

    if (methods.length) {
      const methodsNormalized = <Methods[]>methods.map(x => x.toLowerCase());
      methodsNormalized.forEach((m) => {
        if (keep && replacement[path]) {
          replacement[path][m] = paths[path][m];
        } else if (keep) {
          replacement[path] = replacement[path] || {};
          replacement[path][m] = paths[path][m];
        } else {
          delete paths[path][m];
        }
      });
    } else if (keep) {
      replacement[path] = paths[path];
    } else {
      delete paths[path];
    }
  }

  return keep ? replacement : paths;
}
