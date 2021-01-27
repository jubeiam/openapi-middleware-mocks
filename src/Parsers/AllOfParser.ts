import Parser, { ParserSchemaObject, ParserNonArraySchemaObject } from './Parser';

export default class AllOfParser {
  constructor(private parser: Parser) { }

  public canParse(node: ParserSchemaObject) {
    return 'allOf' in node;
  }

  public parse(node: ParserNonArraySchemaObject) {
    return this.generateObject(node);
  }

  public generateObject(node: ParserNonArraySchemaObject) {
    return node.allOf.reduce(
      (s, o) => Object.assign(s, this.parser.parse(o)),
      {}
    );
  }
}
