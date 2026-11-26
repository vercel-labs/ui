import { definePrimitive } from "@ui-sdk/core"
import { createParts } from "../../src/create-parts"

const marks = definePrimitive({
  name: "marks",
  options: {},
  asleep: () => true,
  state: () => ({}),
  sync: () => ({}),
  api: () => ({}),
  slots: (slot) => ({ root: slot({}), mark: slot({}) }),
})

const { Root: Marks, Mark } = createParts(marks, {
  root: "div",
  mark: "circle",
})

export { Marks, Mark }
