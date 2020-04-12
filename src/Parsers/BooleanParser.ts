import Chance from 'chance';
import { ParserSchemaObject } from './Parser';
const chance = new Chance();

export default class BooleanParser {
    canParse(node: ParserSchemaObject) {
        return node.type === 'boolean';
    }

    parse(node: ParserSchemaObject) {
        return chance.bool(node['x-type-options']);
    }
}