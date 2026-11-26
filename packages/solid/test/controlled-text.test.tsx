import { render } from "@solidjs/web"
import { createSignal, flush } from "solid-js"
import { expect, test } from "vitest"
import { Field, FieldLabel } from "../src/field"
import { Input } from "../src/input"
import { Textarea } from "../src/textarea"

function mount(code: () => any) {
  const root = document.createElement("div")
  document.body.append(root)
  const dispose = render(code, root)
  flush()
  return { root, dispose }
}

const settle = async () => {
  for (let i = 0; i < 3; i++) {
    await Promise.resolve()
  }
  flush()
}

async function type(el: HTMLInputElement | HTMLTextAreaElement, text: string) {
  el.value = text
  el.dispatchEvent(new InputEvent("input", { bubbles: true }))
  await settle()
}

// A value the parent never updates stays, like a controlled input in React.
test("a controlled input or textarea keeps a value the parent doesn't update", async () => {
  const { root, dispose } = mount(() => (
    <>
      <Input value="abc" />
      <Textarea value="abc" />
    </>
  ))
  const input = root.querySelector("input")!
  const textarea = root.querySelector("textarea")!
  await type(input, "abcz")
  await type(textarea, "abcz")
  expect(input.value).toBe("abc")
  expect(textarea.value).toBe("abc")
  dispose()
})

test("a controlled input shows what its parent accepts", async () => {
  const [value, setValue] = createSignal("")
  const { root, dispose } = mount(() => (
    <Input
      value={value()}
      onValueChange={(next) => next.length <= 3 && setValue(next)}
    />
  ))
  const input = root.querySelector("input")!
  for (const text of ["a", "ab", "abc", "abcd"]) {
    await type(input, text)
  }
  expect(value()).toBe("abc")
  expect(input.value).toBe("abc")
  dispose()
})

test("a controlled input with a render keeps its element as the text changes", async () => {
  const [value, setValue] = createSignal("")
  const { root, dispose } = mount(() => (
    <Input
      aria-label="Name"
      value={value()}
      onValueChange={setValue}
      render={(props) => <input {...props} />}
    />
  ))
  const input = root.querySelector("input")!
  await type(input, "ab")
  expect(value()).toBe("ab")
  expect(root.querySelector("input")).toBe(input)
  dispose()
})

test("an input in a field follows a render that changes after it mounts", () => {
  const [area, setArea] = createSignal(true)
  const { root, dispose } = mount(() => (
    <Field>
      <FieldLabel>Notes</FieldLabel>
      <Input render={area() ? (props) => <textarea {...props} /> : undefined} />
    </Field>
  ))
  expect(root.querySelector("[data-slot=input]")!.tagName).toBe("TEXTAREA")
  setArea(false)
  flush()
  expect(root.querySelector("[data-slot=input]")!.tagName).toBe("INPUT")
  dispose()
})
