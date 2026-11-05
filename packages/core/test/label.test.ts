import { expect, test } from "vitest"
import { label } from "../src/components/label/label"
import { attrs } from "../src/foundation/kernel/part"

test("a label renders an id, which a control it names points at", () => {
  expect(attrs(label({ id: "l" }).part("root"))).toEqual({ "data-slot": "label-root", id: "l" })
})
