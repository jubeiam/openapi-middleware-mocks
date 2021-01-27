import Chance from 'chance';
const chance = new Chance();
//@ts-ignore
import RandExp from 'randexp';
import { ParserSchemaObject, ParserNonArraySchemaObject } from './Parser';


export default class StringParser {
    canParse(node: ParserSchemaObject) {
        return 'type' in node && node.type === 'string';
    }

    parse(node: ParserNonArraySchemaObject) {
        return this.parseString(node);
    }

    parseString(node: ParserNonArraySchemaObject) {
        if (node.pattern)
            return new RandExp(node.pattern).gen();

        let options = this.resolveChanceOptions(node);
        return chance.string(options);
    }

    resolveChanceOptions(node: ParserNonArraySchemaObject) {
        let options = node['x-type-options'] || {};

        if (node.maxLength && node.minLength)
            options.length = chance.integer({ max: node.maxLength, min: node.minLength });
        else
            options.length = options.length || node.maxLength || node.minLength;

        return options;
    }
}