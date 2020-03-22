"use strict";

import Parser from "./Parsers/Parser";
const parser = new Parser();

export default function MockData(definition, responseCode) {
  const def = definition.schema
    ? definition
    : (definition.content || {})["application/json"];

  if (!def) {
    return null;
  }

  if (!def.schema) {
    if (process.env.debug) {
      console.warn("Schema not found");
    }

    return null;
  }

  return parser.parse(def.schema);
}
