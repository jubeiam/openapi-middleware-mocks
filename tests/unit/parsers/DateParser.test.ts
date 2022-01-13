import DateParser from "../../../src/Parsers/DateParser";

test('parse date', () => {

    const parser = new DateParser();

    const result = parser.parse({
        type: 'string',
        format: 'date'
    })

    expect(new Date(result).getFullYear()).toBe(new Date().getFullYear())
});