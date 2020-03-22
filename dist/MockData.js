"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = MockData;

var _ParsersParser = require("./Parsers/Parser");

var _ParsersParser2 = _interopRequireDefault(_ParsersParser);

var parser = new _ParsersParser2["default"]();

function MockData(definition, responseCode) {
  var def = definition.schema ? definition : (definition.content || {})["application/json"];

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

module.exports = exports["default"];