interface Config {
    swaggerFile: string;
    ignorePaths: string[];
    mockPaths: string[];
    watch: boolean;
}
declare function indexFunc(config: Config): (req: any, res: any, next: any) => void;
export { Config, indexFunc as default };
