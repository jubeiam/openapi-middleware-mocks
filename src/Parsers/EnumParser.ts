import Chance from 'chance';
const chance = new Chance();
import { OpenApi } from './OpenApi'


export default class EnumParser {
    canParse(node: OpenApi.Schema) {
        return node.type === 'string' && 'enum' in node;
    }

    parse(node: OpenApi.SchemaEnum) {
        return this.parseEnum(node.enum);
    }

    parseEnum(enumNode: string[]) {
        let index = chance.integer({ min: 0, max: enumNode.length - 1 });
        return enumNode[index];
    }
}