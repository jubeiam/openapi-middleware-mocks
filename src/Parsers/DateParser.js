import Chance from 'chance';
const chance = new Chance();

let isDate = RegExp.prototype.test.bind(/^date([Tt]ime)?$/);

export default class DateParser {
    canParse(node) {
        return isDate(node.type);
    }
    
    parse(node) {
        return chance.date(node['x-type-options']);
    }
}