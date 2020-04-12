import Parser, { ParserSchemaObject } from './Parser';

export default class AllOfParser {
  constructor(private parser: Parser) { }

  public canParse(node: ParserSchemaObject) {
    return 'allOf' in node;
  }

  public parse(node: ParserSchemaObject) {
    return this.generateObject(node);
  }

  public generateObject(node: ParserSchemaObject) {
    return node.allOf.reduce(
      (s, o) => Object.assign(s, this.parser.parse(o)),
      {}
    );
  }
}
