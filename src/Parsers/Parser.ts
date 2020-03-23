import StringParser from "./StringParser";
import ObjectParser from "./ObjectParser";
import ArrayParser from "./ArrayParser";
import NumberParser from "./NumberParser";
import DateParser from "./DateParser";
import BooleanParser from "./BooleanParser";
import AllOfParser from "./AllOfParser";
import EnumParser from "./EnumParser";
import Chance from "chance";
import { OpenApi } from './OpenApi'

const chance = new Chance();
const parsers: ParserFunc[] = [];

export interface ParserFunc {
    canParse(node: OpenApi.Schema): boolean
    parse(node: OpenApi.Schema): any
}

export default class Parser {

    get parsers() {
        if (!parsers.length) {
            parsers.push.apply(parsers, [
                new EnumParser(),
                new NumberParser(),
                new BooleanParser(),
                new DateParser(),
                new StringParser(),
                new ObjectParser(this),
                new ArrayParser(this),
                new AllOfParser(this),
            ]);
        }

        return parsers;
    }

    getParser(node: OpenApi.Schema): ParserFunc {
        let parser = this.parsers.find(p => p.canParse(node));

        if (!parser) {
            throw new Error(`Can't handle ${node.type || "Unknown"} type.`);
        }

        return parser;
    }

    parse(node: OpenApi.Schema): any {
        if ('x-type-value' in node) {
            return node["x-type-value"];
        }

        if ('x-chance-type' in node && typeof chance[node["x-chance-type"]] === 'function') {
            // @ts-ignore
            return chance[node["x-chance-type"]](node["x-type-options"]);
        }

        return this.getParser(node).parse(node);
    }
}
