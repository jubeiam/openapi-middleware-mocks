import StringParser from "./StringParser";
import ObjectParser from "./ObjectParser";
import ArrayParser from "./ArrayParser";
import NumberParser from "./NumberParser";
import DateParser from "./DateParser";
import BooleanParser from "./BooleanParser";
import AllOfParser from "./AllOfParser";
import EnumParser from "./EnumParser";
import Chance from "chance";
import { OpenAPIV3 } from "openapi-types";

const chance = new Chance();
const parsers: ParserFunc[] = [];

export type ParserSchemaObject = ParserArraySchemaObject | ParserNonArraySchemaObject;

export interface ParserArraySchemaObject extends ParserBaseSchemaObject {
    type: OpenAPIV3.ArraySchemaObjectType;
    items: ParserSchemaObject;
}
export interface ParserNonArraySchemaObject extends ParserBaseSchemaObject {
    type: OpenAPIV3.NonArraySchemaObjectType;
}

type ParserBaseSchemaObject = Omit<OpenAPIV3.BaseSchemaObject, 'allOf'> & {
    allOf?: ParserSchemaObject[]
    'x-type-options'?: any
    'x-chance-type'?: Extract<keyof Chance.Chance, Function>
    'x-type-value'?: any
}

export interface ParserFunc {
    canParse(node: ParserSchemaObject): boolean
    parse(node: ParserSchemaObject): any
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

    getParser(node: ParserSchemaObject): ParserFunc {
        let parser = this.parsers.find(p => p.canParse(node));

        if (!parser) {
            throw new Error(`Can't handle ${node.type || "Unknown"} type.`);
        }

        return parser;
    }

    parse(node: ParserSchemaObject): any {
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
