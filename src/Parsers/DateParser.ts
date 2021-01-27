import Chance from 'chance';
import { ParserSchemaObject } from './Parser';
const chance = new Chance();

export default class DateParser {
    canParse(node: ParserSchemaObject) {
        return 'type' in node && node.type === 'string' && 'format' in node && node.format === 'date';
    }

    parse(node: ParserSchemaObject) {
        const d = new Date(chance.timestamp())

        return d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2);
    }
}