import { expect, test } from "vitest";
import { csto } from "./csto";

const fields: Record<string, any> = {
  title: "Test",
  count: 20,
  isTest: true,
  tags: ["test", 1],
  links: [
    { title: "link one", href: "/one" },
    { title: "link two", herrfff: "/two" },
  ],
  test: {
    moved: true,
    transformed: "unchanged",
    nested: {
      first: "test",
      second: "10",
    },
  },
};

const props: Record<string, any> = {};

test("schema set", () => {
  csto(fields, props, {
    title: "string",
    count: "number",
    isTest: "boolean",
    tags: {
      type: "array",
      schema: "string",
    },
    links: {
      type: "array",
      schema: {
        title: "string",
        href: "string",
      },
    },
    "test.nested": {
      schema: {
        first: "string",
        second: "number",
      },
    },
    "test.moved": {
      to: "moved",
      type: "boolean",
    },
    "test.transformed": {
      to: "transformed",
      type: "string",
      transform(data: string) {
        return data + " changed";
      },
    },
  });

  // string
  expect(props.title).toEqual(fields.title);
  // number
  expect(props.count).toEqual(fields.count);
  // boolean
  expect(props.isTest).toEqual(fields.isTest);

  // array of strings
  expect(props.tags[0]).toEqual(fields.tags[0]);
  expect(props.tags[1]).toEqual(undefined);

  // array of objects
  expect(props.links[0].title).toEqual(fields.links[0].title);
  expect(props.links[0].href).toEqual(fields.links[0].href);
  expect(props.links[1].href).toEqual(undefined);

  // nested values
  expect(props.test.nested.first).toEqual(fields.test.nested.first);
  expect(props.test.nested.second).toEqual(undefined);

  // to different path
  expect(props.moved).toEqual(fields.test.moved);

  // transformed result
  expect(props.transformed).toEqual(fields.test.transformed + " changed");
});
