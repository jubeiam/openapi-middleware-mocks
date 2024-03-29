import Chance from 'chance';
import { ParserSchemaObject } from './Parser';
const chance = new Chance();

export default class DateTimeParser {
    canParse(node: ParserSchemaObject) {
        return 'type' in node && node.type === 'string' && 'format' in node && node.format === 'date-time';
    }

    parse(node: ParserSchemaObject) {
        const d = new Date(chance.timestamp() * 1000);
        d.setFullYear(new Date().getFullYear());

        return d.getFullYear()
            + '-'
            + ("0" + (d.getMonth() + 1)).slice(-2)
            + '-'
            + ("0" + d.getDate()).slice(-2)
            + 'T'
            + ("0" + (d.getHours() + 1)).slice(-2)
            + ':'
            + ("0" + (d.getMinutes() + 1)).slice(-2)
            + ':'
            + ("0" + (d.getSeconds() + 1)).slice(-2)
            + 'Z'
    }
}