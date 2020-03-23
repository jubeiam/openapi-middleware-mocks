import Chance from 'chance';
import Parser from './Parser';
import { OpenApi } from './OpenApi';

const chance = new Chance();

export default class ArrayParser {
    constructor(private parser: Parser) { }

    canParse(node: OpenApi.Schema) {
        return node.type === 'array';
    }

    parse(node: OpenApi.SchemaArray) {
        return this.generateArray(node);
    }

    generateArray(node: OpenApi.SchemaArray) {
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