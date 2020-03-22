import Chance from 'chance';
const chance = new Chance();

export default class BooleanParser {
    canParse(node) {
        return node.type === 'boolean';
    }
    
    parse(node) {
        return chance.bool(node['x-type-options']);
    }
}