import { OpenAPIV3 } from 'openapi-types';
interface Config {
    openApiFile?: string;
    openApi?: OpenAPIV3.Document;
    ignorePaths?: string[];
    mockPaths?: string[];
    format400?: () => {};
    format404?: () => {};
}
declare function indexFunc(config: Config): Promise<(req: any, res: any, next: any) => any>;
export { Config, indexFunc as default };
