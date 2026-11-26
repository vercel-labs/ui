// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest"
import { combobox } from "../src/components/combobox/combobox"
import { mount } from "../src/testing"

afterEach(() => {
  vi.restoreAllMocks()
  document.body.replaceChildren()
})

const markup = `<input aria-label="City"></input><content><list></list></content>`

function compose(input: HTMLInputElement, text: string) {
  input.value = text
  input.dispatchEvent(
    new InputEvent("input", {
      bubbles: true,
      isComposing: true,
      inputType: "insertCompositionText",
      data: text,
    })
  )
}

function endComposition(input: HTMLInputElement) {
  input.dispatchEvent(
    new CompositionEvent("compositionend", { bubbles: true, data: input.value })
  )
}

function insert(input: HTMLInputElement, text: string) {
  input.value = text
  input.dispatchEvent(
    new InputEvent("input", { bubbles: true, inputType: "insertText" })
  )
}

function setup() {
  const heard: string[] = []
  const view = mount(
    combobox,
    {
      items: ["Zürich", "東京", "大阪"],
      onQueryChange: (query, details) =>
        heard.push(details.composing ? `(${query})` : query),
    },
    markup
  )
  const input = view.part("input") as HTMLInputElement
  input.focus()
  const listed = () => view.api.internal.listbox.entries().map((e) => e.label)
  return { view, input, heard, listed }
}

test("composing text follows the input but doesn't filter until it ends", () => {
  const { view, input, heard, listed } = setup()
  compose(input, "とうk")
  compose(input, "東京")
  expect(view.state.query).toBe("東京")
  expect(listed()).toEqual(["Zürich", "東京", "大阪"])
  endComposition(input)
  expect(listed()).toEqual(["東京"])
  expect(heard).toEqual(["(とうk)", "(東京)", "東京"])
  view.unmount()
})

test("an input after the composition ends reports the text once", () => {
  const { view, input, heard } = setup()
  compose(input, "z¨")
  endComposition(input)
  insert(input, "zü")
  insert(input, "zü")
  expect(heard).toEqual(["(z¨)", "z¨", "zü"])
  view.unmount()
})

test("text typed after a filter keeps filtering from it while composing", () => {
  const { view, input, listed } = setup()
  insert(input, "z")
  compose(input, "z¨")
  expect(listed()).toEqual(["Zürich"])
  view.unmount()
})

test("composing over a selected value's label keeps the items, not the empty list's", () => {
  const view = mount(
    combobox,
    {
      items: ["東京", "大阪"],
      emptyItems: ["Recent"],
      defaultValue: "東京",
    },
    markup
  )
  const input = view.part("input") as HTMLInputElement
  input.focus()
  const listed = () => view.api.internal.listbox.entries().map((e) => e.label)
  expect(listed()).toEqual(["東京", "大阪"])
  compose(input, "東京お")
  expect(listed()).toEqual(["東京", "大阪"])
  view.unmount()
})

test("an Android keyboard composing each word filters as it's typed", () => {
  vi.spyOn(navigator, "userAgent", "get").mockReturnValue(
    "Mozilla/5.0 (Linux; Android 15; Pixel 9) Chrome/131.0 Mobile"
  )
  const heard: string[] = []
  const view = mount(
    combobox,
    {
      items: ["Belgium", "Brazil", "France"],
      onQueryChange: (query, details) =>
        heard.push(details.composing ? `(${query})` : query),
    },
    markup
  )
  const input = view.part("input") as HTMLInputElement
  input.focus()
  for (const text of ["b", "br", "bra"]) {
    compose(input, text)
  }
  expect(view.api.internal.listbox.entries().map((e) => e.label)).toEqual([
    "Brazil",
  ])
  expect(heard).toEqual(["b", "br", "bra"])
  view.unmount()
})

test("Hangul composing each syllable filters as it's typed", () => {
  const heard: string[] = []
  const view = mount(
    combobox,
    {
      items: ["한국", "하노이", "東京"],
      onQueryChange: (query, details) =>
        heard.push(details.composing ? `(${query})` : query),
    },
    markup
  )
  const input = view.part("input") as HTMLInputElement
  input.focus()
  for (const text of ["ㅎ", "하", "한"]) {
    compose(input, text)
  }
  expect(view.api.internal.listbox.entries().map((e) => e.label)).toEqual([
    "한국",
  ])
  expect(heard).toEqual(["ㅎ", "하", "한"])
  view.unmount()
})
