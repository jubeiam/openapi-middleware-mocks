import Chance from 'chance';
const chance = new Chance();
import { OpenApi } from './OpenApi'

const isString = (node: OpenApi.Schema): boolean => {
    return node.type === 'string'
}

export default class ByteParser {
    canParse(node: OpenApi.Schema) {
        return node.type === 'string' && 'format' in node && node.format === 'byte';
    }

    parse(node: OpenApi.SchemaString) {
        return new Buffer('' + chance.integer({ min: 0, max: 255 })).toString('base64');
    }
}