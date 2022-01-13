import DateTimeParser from "../../../src/Parsers/DateTimeParser";

test('parse date time', () => {

    const parser = new DateTimeParser();

    const result = parser.parse({
        type: 'string',
        format: 'date-time'
    })

    expect(new Date(result).getFullYear()).toBe(new Date().getFullYear())
});