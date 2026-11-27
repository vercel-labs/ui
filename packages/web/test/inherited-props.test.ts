// @vitest-environment jsdom
import { definePrimitive } from "@ui-sdk/core"
import { beforeAll, expect, test } from "vitest"
import { createParts } from "../src"

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

const grid = definePrimitive({
  name: "inherited-props",
  state: () => ({}),
  api: () => ({}),
  slots: (slot) => ({
    root: slot({}),
    row: slot<{ value?: string; disabled?: boolean }>({
      props: { value: "string", disabled: "boolean" },
    }),
    cell: slot<{ value?: string; rowDisabled?: boolean }>({
      props: {
        value: { kind: "string", from: "row" },
        rowDisabled: { kind: "boolean", from: "row.disabled" },
      },
      attrs: (_, { props }) => ({
        "data-value": props.value ?? "none",
        "data-row-disabled": String(props.rowDisabled ?? false),
      }),
    }),
  }),
  agent: { actions: [] },
})

beforeAll(() => {
  createParts(grid, {
    root: "inherited-grid",
    row: "inherited-row",
    cell: "inherited-cell",
  })
})

test("a part's own attribute or property wins over the value around it", async () => {
  document.body.innerHTML = `
    <inherited-grid>
      <inherited-row value="row-1">
        <inherited-cell id="inherits"></inherited-cell>
        <inherited-cell id="attribute" value="own"></inherited-cell>
        <inherited-cell id="property"></inherited-cell>
      </inherited-row>
    </inherited-grid>`
  ;(
    document.getElementById("property") as HTMLElement & { value: string }
  ).value = "own"
  await wait()
  const value = (id: string) =>
    document.getElementById(id)!.getAttribute("data-value")
  expect([value("inherits"), value("attribute"), value("property")]).toEqual([
    "row-1",
    "own",
    "own",
  ])
  document.getElementById("attribute")!.removeAttribute("value")
  await wait()
  expect(value("attribute")).toBe("row-1")
})

test("a part's own false wins over a true around it", async () => {
  document.body.innerHTML = `
    <inherited-grid>
      <inherited-row disabled>
        <inherited-cell id="inherits"></inherited-cell>
        <inherited-cell id="own"></inherited-cell>
      </inherited-row>
    </inherited-grid>`
  const own = document.getElementById("own") as HTMLElement & {
    rowDisabled: boolean | null
  }
  own.rowDisabled = false
  await wait()
  const disabled = (id: string) =>
    document.getElementById(id)!.getAttribute("data-row-disabled")
  expect([disabled("inherits"), disabled("own")]).toEqual(["true", "false"])
  own.rowDisabled = null
  await wait()
  expect(disabled("own")).toBe("true")
})
