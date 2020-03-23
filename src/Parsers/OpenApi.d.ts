import Chance from "chance";

export module OpenApi {
    type Type = 'string' | 'array' | 'object' | 'integer' | 'float'

    interface ObjectConfig {
        [propName: string]: Schema
    }

    interface SchemaCommon {
        'x-type-options'?: any
        'x-chance-type'?: Extract<keyof Chance.Chance, Function>
        'x-type-value'?: any
        pattern?: string
    }

    interface SchemaNumber extends SchemaCommon {
        type: 'number'
        format?: 'float' | 'double'
        minimum?: number
        maximum?: number
        default?: number
        multipleOf?: number
        exclusiveMinimum?: number
        exclusiveMaximum?: number
    }

    interface SchemaInteger extends SchemaCommon {
        type: 'integer'
        format?: 'int32' | 'int64'
        minimum?: number
        maximum?: number
        default?: number
        multipleOf?: number
        exclusiveMinimum?: number
        exclusiveMaximum?: number
    }

    interface SchemaString extends SchemaCommon {
        type: 'string'
        default?: string
        minLength?: number
        maxLength?: number
        format?: string
    }

    interface SchemaEnum extends SchemaCommon {
        type: 'string'
        enum: string[]
        default?: string
    }

    interface SchemaArray extends SchemaCommon {
        type: 'array'
        items: Schema
        default?: Schema[]
        minItems?: number
        maxItems?: number
    }

    interface SchemaObject extends SchemaCommon {
        type: 'object'
        properties: ObjectConfig
        required?: string[]
        default?: any
    }

    interface SchemaBoolean extends SchemaCommon {
        type: 'boolean'
        default?: boolean
    }


    interface SchemaBoolean extends SchemaCommon {
        type: 'boolean'
        default?: boolean
    }

    interface SchemaAllOf extends SchemaCommon {
        allOf: Schema[]
    }

    interface SchemaOneOf extends SchemaCommon {
        oneOf: Schema[]
    }

    interface SchemaAnyOf extends SchemaCommon {
        anyOf: Schema[]
    }

    type SchemaXOf = SchemaAllOf | SchemaOneOf | SchemaAnyOf

    type Schema = SchemaNumber | SchemaString | SchemaArray | SchemaObject | SchemaEnum | SchemaInteger | SchemaBoolean
}

