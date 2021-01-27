import Chance from 'chance';
import { ParserSchemaObject, ParserNonArraySchemaObject } from './Parser';
const chance = new Chance();

export default class BooleanParser {
    canParse(node: ParserSchemaObject) {
        return 'type' in node && node.type === 'boolean';
    }

    parse(node: ParserNonArraySchemaObject) {
        return chance.bool(node['x-type-options']);
    }
}