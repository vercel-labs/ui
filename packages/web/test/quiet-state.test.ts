// @vitest-environment jsdom
// State set from script, through a live property or a state attribute, commits
// without events, like a native input's `value`. The `api` and people still fire them.
import { beforeAll, expect, test } from "vitest"
import type { UiToggleGroupElement } from "../src/events"
import { defineToggleGroupElements } from "../src/toggle"

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

beforeAll(() => defineToggleGroupElements())

async function mount() {
  document.body.innerHTML = `<ui-toggle-group aria-label="Layout" value="list"><ui-toggle value="list"><button>List</button></ui-toggle><ui-toggle value="board"><button>Board</button></ui-toggle></ui-toggle-group>`
  await wait()
  const group = document.body.firstElementChild as UiToggleGroupElement
  const heard: string[][] = []
  group.addEventListener("valuechange", (event) => heard.push(event.detail.value))
  return { group, heard }
}

test("setting the value property commits without an event", async () => {
  const { group, heard } = await mount()
  group.value = ["board"]
  expect(group.value).toEqual(["board"])
  expect(heard).toEqual([])
})

test("setting the value attribute commits without an event", async () => {
  const { group, heard } = await mount()
  group.setAttribute("value", "board")
  expect(group.value).toEqual(["board"])
  expect(heard).toEqual([])
})

test("a page that renders the value back from its listener hears each change once", async () => {
  const { group, heard } = await mount()
  group.addEventListener("valuechange", (event) => {
    group.value = [...event.detail.value]
  })
  group.querySelector<HTMLButtonElement>('ui-toggle[value="board"] button')!.click()
  expect(heard).toEqual([["board"]])
  expect(group.value).toEqual(["board"])
})

test("the api and presses still fire events", async () => {
  const { group, heard } = await mount()
  group.api.setValue(["board"])
  group.querySelector<HTMLButtonElement>('ui-toggle[value="list"] button')!.click()
  expect(heard).toEqual([["board"], ["list"]])
})
