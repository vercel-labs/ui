// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { defineFileInputElements } from "../src/file-input"

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  defineFileInputElements()
})

const paste = (target: Element, files: File[]) => {
  const event = new Event("paste", { bubbles: true, cancelable: true })
  Object.defineProperty(event, "clipboardData", { value: { files } })
  target.dispatchEvent(event)
}

for (const [name, target] of [
  ["an element", (prompt: HTMLElement) => prompt],
  ["a function", (prompt: HTMLElement) => () => prompt],
] as const) {
  test(`a drop zone's pasteTarget property keeps ${name}`, async () => {
    document.body.innerHTML = `
      <ui-file-input id="files" multiple>
        <ui-file-input-dropzone id="zone"><span>Drop here</span></ui-file-input-dropzone>
      </ui-file-input>
      <textarea id="prompt"></textarea>`
    await wait()
    const prompt = document.getElementById("prompt")!
    const zone = document.getElementById("zone") as HTMLElement & {
      pasteTarget: unknown
    }
    const value = target(prompt)
    zone.pasteTarget = value
    await wait()
    expect(zone.pasteTarget).toBe(value)
    expect(zone.hasAttribute("paste-target")).toBe(false)
    paste(prompt, [new File(["png"], "shot.png", { type: "image/png" })])
    await wait()
    const input = document.getElementById("files") as HTMLElement & {
      value: File[]
    }
    expect(input.value.map((file) => file.name)).toEqual(["shot.png"])
  })
}
