import Chance from 'chance';
const chance = new Chance();
//@ts-ignore
import RandExp from 'randexp';
import { ParserSchemaObject } from './Parser';


export default class StringParser {
    canParse(node: ParserSchemaObject) {
        return node.type === 'string';
    }

    parse(node: ParserSchemaObject) {
        return this.parseString(node);
    }

    parseString(node: ParserSchemaObject) {
        if (node.pattern)
            return new RandExp(node.pattern).gen();

        let options = this.resolveChanceOptions(node);
        return chance.string(options);
    }

    resolveChanceOptions(node: ParserSchemaObject) {
        let options = node['x-type-options'] || {};

        if (node.maxLength && node.minLength)
            options.length = chance.integer({ max: node.maxLength, min: node.minLength });
        else
            options.length = options.length || node.maxLength || node.minLength;

        return options;
    }
}