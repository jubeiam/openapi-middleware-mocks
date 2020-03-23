import Chance from 'chance';
const chance = new Chance();
import { OpenApi } from './OpenApi'

export default class NumberParser {
    canParse(node: OpenApi.Schema) {
        return this.isInteger(node) || this.isFloating(node);
    }

    parse(node: OpenApi.SchemaNumber) {
        if (this.isInteger(node))
            return this.generateInteger(node);

        if (this.isFloating(node))
            return chance.floating(node['x-type-options']);
    }

    generateInteger(node: OpenApi.SchemaNumber) {
        let bounds = this.resolveBounds(node);
        return chance.integer(bounds) * (node.multipleOf || 1);
    }

    resolveBounds(node: OpenApi.SchemaNumber) {
        let bounds = { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER };

        Object.assign(bounds, node['x-type-options']);

        if (node.multipleOf < 1) {
            throw new Error(`The value of "multipleOf" MUST be a JSON number. This number MUST be strictly greater than 0.`);
        }

        if (node.maximum) {
            bounds.max = node.maximum + (node.exclusiveMaximum ? -1 : 0);
        }

        if (node.minimum) {
            bounds.min = node.minimum + (node.exclusiveMinimum ? 1 : 0);
        }

        //http://mathforum.org/library/drmath/view/60913.html
        if (node.multipleOf) {
            bounds.min = bounds.min / node.multipleOf;
            bounds.max = bounds.max / node.multipleOf;
        }

        return bounds;
    }

    isInteger(node: OpenApi.Schema) {
        return node.type === 'integer';
    }

    isFloating(node: OpenApi.Schema) {
        return node.type === 'number' && 'format' in node && (node.format === 'float' || node.format === 'double');
    }
}