import Chance from 'chance';
import { OpenApi } from './OpenApi';
const chance = new Chance();

export default class DateParser {
    canParse(node: OpenApi.Schema) {
        return node.type === 'string' && 'format' in node && node.format === 'date-time';
    }

    parse(node: OpenApi.SchemaString) {
        const d = new Date(chance.timestamp())

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