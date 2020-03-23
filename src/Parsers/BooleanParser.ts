import Chance from 'chance';
import { OpenApi } from './OpenApi';
const chance = new Chance();

export default class BooleanParser {
    canParse(node: OpenApi.Schema) {
        return node.type === 'boolean';
    }

    parse(node: OpenApi.SchemaBoolean) {
        return chance.bool(node['x-type-options']);
    }
}