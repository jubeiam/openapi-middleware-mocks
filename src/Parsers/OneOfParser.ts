import Parser, { ParserSchemaObject, ParserArraySchemaObject, ParserNonArraySchemaObject } from './Parser';

export default class OneOfParser {
    constructor(private parser: Parser) { }

    public canParse(node: ParserSchemaObject) {
        return 'oneOf' in node;
    }

    public parse(node: ParserSchemaObject) {
        if (!node.oneOf) {
            throw new Error('Invalid node');
        }

        const oneOf = node.oneOf
        const rnd = this.getRandomInt(0, oneOf.length - 1);

        return this.parser.parse(<ParserArraySchemaObject | ParserNonArraySchemaObject>oneOf[rnd]);
    }

    private getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min +1)) + min;
    }
}
