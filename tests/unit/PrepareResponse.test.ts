import { validateDataAgainstSchema } from "../../src/PrepareResponse";
import { ParserSchemaObject } from "../../src/Parsers/Parser";

const schema = <ParserSchemaObject>{
    type: "object",
    required: ["name"],
    properties: {
        name: {
            type: "string",
        },
        tag: {
            type: "string",
        },
    },
};

const oneOfSchema = <ParserSchemaObject>{
    oneOf: [
        {
            type: "object",
            required: ["name"],
            properties: {
                name: {
                    type: "string",
                },
                tag: {
                    type: "string",
                },
            },
        },
        {
            type: "object",
            required: ["tag"],
            properties: {
                name: {
                    type: "string",
                },
                tag: {
                    type: "string",
                },
            },
        },
    ],
};

test("Empty request body", () => {
    const valid = validateDataAgainstSchema("", schema);
    expect(typeof valid).toEqual("string");
});

test("Invalid request body", () => {
    const valid = validateDataAgainstSchema({ name: 1 }, schema);
    expect(typeof valid).toEqual("string");
});

test("Missing required params in request body", () => {
    const valid = validateDataAgainstSchema({ tag: "1" }, schema);
    expect(typeof valid).toEqual("string");
});

test("Valid request body", () => {
    const valid = validateDataAgainstSchema({ name: "1" }, schema);
    expect(valid).toEqual(true);
});

test("Valid request body against oneOf schema", () => {
    const valid = validateDataAgainstSchema({ name: "1" }, oneOfSchema);
    expect(valid).toEqual(true);
});

test("Valid request body against oneOf schema", () => {
    const valid = validateDataAgainstSchema({ tag: "1" }, oneOfSchema);
    expect(valid).toEqual(true);
});
