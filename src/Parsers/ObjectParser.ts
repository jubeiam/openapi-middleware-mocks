//@ts-ignore
import hoek from 'hoek';
import Parser, { ParserFunc } from './Parser';
import { OpenApi } from './OpenApi'

export default class ObjectParser implements ParserFunc {
    constructor(private parser: Parser) {
    }
    canParse(node: OpenApi.Schema) {
        return node.type === 'object';
    }

    parse(node: OpenApi.SchemaObject) {
        return this.generateObject(node);
    }

    generateObject(node: OpenApi.SchemaObject) {
        const ret: any = {};
        const schema = <OpenApi.SchemaObject>hoek.clone(node);
        const properties = schema.properties;

        for (let k in properties) {
            ret[k] = this.parser.parse(properties[k]);
        }

        return ret;
    }
}