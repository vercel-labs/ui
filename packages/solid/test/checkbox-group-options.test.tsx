import { createMemo, createSignal, flush, For } from "solid-js"
import { render } from "@solidjs/web"
import { afterEach, expect, test } from "vitest"
import { Checkbox, CheckboxGroup, CheckboxIndicator } from "../src/checkbox"

let dispose: (() => void) | undefined
afterEach(() => {
  dispose?.()
  document.body.replaceChildren()
})

test("grouped checkboxes show the group's value after the page of rows changes", async () => {
  const pages = [
    ["a", "b", "c"],
    ["d", "e", "f"],
  ]
  const [page, setPage] = createSignal(0)
  const [selected, setSelected] = createSignal<string[]>([])
  const rows = createMemo(() => pages[page()])
  const checked = createMemo(() => selected().filter((id) => rows().includes(id)))
  dispose = render(
    () => (
      <CheckboxGroup aria-label="Rows" value={checked()} onValueChange={setSelected} allValues={rows()}>
        <Checkbox parent aria-label="All" disabled={rows().length === 0}>
          <CheckboxIndicator>x</CheckboxIndicator>
        </Checkbox>
        <For each={rows()}>{(id) => <Checkbox value={id} aria-label={id} />}</For>
      </CheckboxGroup>
    ),
    document.body,
  )
  flush()
  const box = (label: string) => document.querySelector<HTMLElement>(`[aria-label="${label}"]`)!
  const settle = () => new Promise((resolve) => setTimeout(resolve, 10))
  box("a").click()
  await settle()
  box("b").click()
  await settle()
  setPage(1)
  await settle()
  setPage(0)
  await settle()
  expect(["All", "a", "b", "c"].map((label) => box(label).getAttribute("aria-checked"))).toEqual([
    "mixed",
    "true",
    "true",
    "false",
  ])
})
