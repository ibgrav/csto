declare type TypeOf = "any" | "string" | "number" | "boolean" | "object" | "array";

export interface SchemaDefinition {
    to?: string;
    type?: TypeOf;
    schema?: TypeOf | Schema;
    transform?: (data: any) => any;
}

export interface Schema {
    [from: string]: TypeOf | SchemaDefinition;
}

export declare function csto(source: any, dest: any, schema: TypeOf | Schema): any;