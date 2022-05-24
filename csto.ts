import { dset } from "dset";
import delve from "dlv";

type TypeOf = "any" | "string" | "number" | "boolean" | "object" | "array" | "function";

export interface SchemaDefinition {
  to?: string;
  type?: TypeOf;
  schema?: TypeOf | Schema;
  transform?: (data: any) => any;
}

export interface Schema {
  [from: string]: TypeOf | SchemaDefinition;
}

export function cast(source: any, dest: any, schema: TypeOf | Schema) {
  if (!source || !schema || !dest) return;

  if (typeof schema === "string") {
    return (schema === "any" || typeof source === schema) && source;
  }

  if (typeof schema !== "object") return;

  for (let [key, set = {}] of Object.entries(schema)) {
    if (typeof set === "string") {
      set = { type: set };
    }

    let value = delve(source, key);
    const to = set.to || key;

    if (typeof set.type === "string") {
      if (set.type === "array" && set.schema) {
        const array = [];

        if (Array.isArray(value)) {
          for (const item of value) {
            if (typeof set.schema === "string") {
              const primitive = cast(item, {}, set.schema);
              if (primitive) array.push(primitive);
            } else {
              const obj = {};
              cast(item, obj, set.schema);
              array.push(obj);
            }
          }
        }

        dset(dest, to, array);
      } else {
        if (set.type === "any" || (value && typeof value === set.type)) {
          if (typeof set.transform === "function") {
            value = set.transform(value);
          }

          dset(dest, to, value);
        }
      }
    } else if (set.schema && typeof set.schema === "object") {
      const obj = {};
      cast(value, obj, set.schema);
      dset(dest, to, obj);
    }
  }
}
