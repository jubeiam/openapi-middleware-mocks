import Parser from './Parser';
import { OpenApi } from './OpenApi';

export default class AllOfParser {
  constructor(private parser: Parser) { }

  public canParse(node: OpenApi.SchemaXOf) {
    return 'allOf' in node;
  }

  public parse(node: OpenApi.SchemaAllOf) {
    return this.generateObject(node);
  }

  public generateObject(node: OpenApi.SchemaAllOf) {
    return node.allOf.reduce(
      (s, o) => Object.assign(s, this.parser.parse(o)),
      {}
    );
  }
}
