import { OpenAPIV3 } from 'openapi-types'

type Methods = 'get' | 'post' | 'delete' | 'put' | 'options' | 'head'

function pruneMethods(selectedPaths: any, paths: any, path: string, keep = false, method = '') {
  if (keep && selectedPaths[path]) {
    selectedPaths[path][method] = paths[path][method];
  } else if (keep) {
    selectedPaths[path] = {
      [method]: paths[path][method]
    }
  } else if (undefined !== paths[path]) {
    delete paths[path][method];
  }
}

export default function PrunePaths(paths: OpenAPIV3.PathsObject, passthroughPaths: string[], keep = false) {
  const selectedPaths: any = {};

  for (let i = 0; i < passthroughPaths.length; i++) {
    const p = passthroughPaths[i];
    const [path, ...methods] = p.split(" ").reverse();

    if (methods.length) {
      methods
        .map(x => x.toLowerCase())
        .forEach(pruneMethods.bind(null, selectedPaths, paths, path, keep));
    } else if (keep) {
      selectedPaths[path] = paths[path];
    } else {
      delete paths[path];
    }
  }

  return keep ? selectedPaths : paths;
}
