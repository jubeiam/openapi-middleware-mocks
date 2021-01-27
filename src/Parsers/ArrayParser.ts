import Chance from 'chance';
import Parser, { ParserSchemaObject, ParserArraySchemaObject } from './Parser';

const chance = new Chance();

export default class ArrayParser {
    constructor(private parser: Parser) { }

    canParse(node: ParserSchemaObject) {
        return 'type' in node && node.type === 'array';
    }

    parse(node: ParserSchemaObject) {
        return 'items' in node && this.generateArray(node);
    }

    generateArray(node: ParserArraySchemaObject) {
        let items = node.items;
        let options = node['x-type-options'] || {};

        options.min = options.min || node.minItems || 0;
        options.max = options.max || node.maxItems || 10;

        let iterations = chance.integer(options);
        let ret = [];

        for (let i = 0; i < iterations; i++) {
            ret.push(this.parser.parse(items));
        }

        return ret;
    }
}