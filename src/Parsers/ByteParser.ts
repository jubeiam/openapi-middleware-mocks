import Chance from 'chance';
import { ParserSchemaObject } from './Parser';
const chance = new Chance();

const isString = (node: ParserSchemaObject): boolean => {
    return node.type === 'string'
}

export default class ByteParser {
    canParse(node: ParserSchemaObject) {
        return node.type === 'string' && 'format' in node && node.format === 'byte';
    }

    parse(node: ParserSchemaObject) {
        return new Buffer('' + chance.integer({ min: 0, max: 255 })).toString('base64');
    }
}