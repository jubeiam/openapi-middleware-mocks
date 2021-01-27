//@ts-ignore
import hoek from 'hoek';
import Parser, { ParserFunc, ParserSchemaObject, ParserNonArraySchemaObject, ParserArraySchemaObject } from './Parser';

export default class ObjectParser implements ParserFunc {
    constructor(private parser: Parser) {
    }
    canParse(node: ParserSchemaObject) {
        return 'type' in node && node.type === 'object';
    }

    parse(node: ParserNonArraySchemaObject) {
        return this.generateObject(node);
    }

    generateObject(node: ParserNonArraySchemaObject): Object {
        const ret: any = {};
        const schema = <ParserNonArraySchemaObject>hoek.clone(node);
        const properties = schema.properties;

        for (let k in properties) {
            if ('$ref' === k) {
                continue;
            }

            ret[k] = this.parser.parse(<ParserArraySchemaObject | ParserNonArraySchemaObject>properties[k]);
        }

        return ret;
    }
}