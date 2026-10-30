// @vitest-environment jsdom
// A dialog mounted open, like one an overlay manager opens, has no trigger and
// no open to record where focus was, so it returns focus to what had it as it mounted.
import { afterEach, expect, test } from "vitest"
import { dialog } from "../src/components/dialog/dialog"
import { mount } from "../src/testing"

afterEach(() => document.body.replaceChildren())

const settle = () => new Promise((resolve) => setTimeout(resolve, 20))

test("Escape returns focus to what had it when the dialog mounted open", async () => {
  const opener = document.body.appendChild(document.createElement("button"))
  opener.textContent = "Open"
  opener.focus()
  const view = mount(dialog, { defaultOpen: true }, `<content><title>Profile</title><close>Close</close></content>`)
  await settle()
  expect(view.part("content")!.contains(document.activeElement)).toBe(true)
  await view.keys("Escape")
  await settle()
  expect(view.state.open).toBe(false)
  expect(document.activeElement).toBe(opener)
  view.unmount()
})

test("focus on the page body when it mounted gives it nowhere to return to", async () => {
  const view = mount(dialog, { defaultOpen: true }, `<content><title>Profile</title><close>Close</close></content>`)
  await settle()
  await view.keys("Escape")
  await settle()
  expect(document.activeElement).toBe(document.body)
  view.unmount()
})
