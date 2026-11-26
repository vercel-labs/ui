// @vitest-environment jsdom
import { Activity, act } from "react"
import { createRoot } from "react-dom/client"
import { afterEach, expect, test } from "vitest"
import { Field, FieldLabel } from "../src/field"
import { Textarea } from "../src/textarea"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

afterEach(() => document.body.replaceChildren())

function Reply({ open }: { open: boolean }) {
  return open ? (
    <Field>
      <FieldLabel>Reply</FieldLabel>
      <Textarea autoFocus />
    </Field>
  ) : null
}

test("a control that mounts focused marks itself and its field focused", async () => {
  const root = document.body.appendChild(document.createElement("div"))
  const app = createRoot(root)
  await act(async () => app.render(<Reply open={false} />))
  await act(async () => app.render(<Reply open />))
  const textarea = root.querySelector("textarea")!
  expect(document.activeElement).toBe(textarea)
  expect(textarea.hasAttribute("data-focused")).toBe(true)
  expect(
    root.querySelector('[data-slot="field"]')!.hasAttribute("data-focused")
  ).toBe(true)
  await act(async () => app.unmount())
})

function Search({ mode }: { mode: "visible" | "hidden" }) {
  return (
    <>
      <Activity mode={mode}>
        <Field>
          <FieldLabel>Search</FieldLabel>
          <Textarea />
        </Field>
      </Activity>
      <button type="button">Back</button>
    </>
  )
}

test("a field that loses focus while hidden isn't focused when it shows again", async () => {
  const root = document.body.appendChild(document.createElement("div"))
  const app = createRoot(root)
  await act(async () => app.render(<Search mode="visible" />))
  const textarea = root.querySelector("textarea")!
  await act(async () => textarea.focus())
  expect(textarea.hasAttribute("data-focused")).toBe(true)
  await act(async () => app.render(<Search mode="hidden" />))
  await act(async () => root.querySelector("button")!.focus())
  await act(async () => app.render(<Search mode="visible" />))
  expect(textarea.hasAttribute("data-focused")).toBe(false)
  await act(async () => app.unmount())
})
