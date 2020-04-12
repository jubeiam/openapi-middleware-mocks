import Chance from 'chance';
import { ParserSchemaObject } from './Parser';
const chance = new Chance();


export default class EnumParser {
    canParse(node: ParserSchemaObject) {
        return node.type === 'string' && 'enum' in node;
    }

    parse(node: ParserSchemaObject) {
        return this.parseEnum(node.enum);
    }

    parseEnum(enumNode: string[]) {
        let index = chance.integer({ min: 0, max: enumNode.length - 1 });
        return enumNode[index];
    }
}