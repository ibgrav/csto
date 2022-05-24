//@ts-check
import { dset } from "dset";
import delve from "dlv";

let any = "any";
let array = "array";
let string = "string";
let object = "object";
let func = "function";

export function csto(source, dest, schema) {
  if (typeof schema === object) {
    Object.keys(schema).forEach((key) => {
      const set =
        typeof schema[key] === string ? { type: schema[key] } : schema[key];

      let value = delve(source, key);
      let to = set.to || key;

      if (typeof set.type === string) {
        if (set.type === array && set.schema) {
          let array = [];

          if (Array.isArray(value)) {
            for (let item of value) {
              if (typeof set.schema === string) {
                let primitive = csto(item, {}, set.schema);
                if (primitive) array.push(primitive);
              } else {
                let obj = {};
                csto(item, obj, set.schema);
                array.push(obj);
              }
            }
          }

          dset(dest, to, array);
        } else {
          if (set.type === any || (value && typeof value === set.type)) {
            if (typeof set.transform === func) {
              value = set.transform(value);
            }

            dset(dest, to, value);
          }
        }
      } else if (set.schema && typeof set.schema === object) {
        let obj = {};
        csto(value, obj, set.schema);
        dset(dest, to, obj);
      }
    });
  }

  return (schema === any || typeof source === schema) && source;
}
