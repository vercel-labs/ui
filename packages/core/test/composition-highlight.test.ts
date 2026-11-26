// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest"
import { command } from "../src/components/command/command"
import type { CommandData } from "../src/components/command/command"
import { select } from "../src/components/select/select"
import { mount } from "../src/testing/mount"

afterEach(() => document.body.replaceChildren())

const composingInput = (text: string) =>
  new InputEvent("input", {
    isComposing: true,
    inputType: "insertCompositionText",
    data: text,
  })

test("a select's search that commits a composition highlights a match the committed text shows", async () => {
  const view = mount(
    select,
    {},
    `<root><trigger aria-label="Letter"><value /></trigger><content><input aria-label="Search" /><list><item value="a">Alpha</item><item value="b">Beta</item></list></content></root>`
  )
  await view.click(view.part("trigger")!)
  const input = view.part("input") as HTMLInputElement
  input.value = "B"
  input.dispatchEvent(composingInput("B"))
  expect(view.state.highlighted).toBe("a")
  input.dispatchEvent(
    new CompositionEvent("compositionend", { bubbles: true, data: "B" })
  )
  expect(view.state.highlighted).toBe("b")
  view.unmount()
})

const commands: CommandData = [
  { value: "calendar", label: "Calendar" },
  { value: "settings", label: "Settings" },
  { value: "search", label: "Search" },
]

test("a command with its text and value controlled asks for a highlight only for committed text", () => {
  const onValueChange = vi.fn()
  const options = {
    id: "c",
    items: commands,
    query: "",
    value: "calendar",
    onQueryChange() {},
    onValueChange,
  }
  const instance = command(options)
  const field = { value: "sx" } as HTMLInputElement
  instance.api.internal.typed(field, composingInput("sx"))
  expect(onValueChange).not.toHaveBeenCalled()
  instance.setOptions({ ...options, query: "set" })
  field.value = "set"
  const end = new CompositionEvent("compositionend")
  instance.api.internal.onCompositionEnd(field, end)
  expect(onValueChange).toHaveBeenCalledTimes(1)
  expect(onValueChange).toHaveBeenLastCalledWith(
    "settings",
    expect.objectContaining({ reason: "input-change", event: end })
  )
})
