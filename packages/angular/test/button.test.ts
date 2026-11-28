// @vitest-environment jsdom
import { Component } from "@angular/core"
import { describe, expect, test } from "vitest"
import { Button, type ButtonAction } from "../src/button"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [Button],
  template: `
    <button uiButton id="plain">Plain</button>
    <button uiButton id="submit" type="submit">Submit</button>
    <button uiButton id="off" disabled>Off</button>
    <button uiButton id="held" disabled focusableWhenDisabled>Held</button>
    <button uiButton id="save" #save="uiButton" (action)="run($event)">
      {{ save.state().pending ? "Saving" : "Save" }}
    </button>
    <a uiButton id="link" href="#x">Link</a>
  `,
})
class Page {
  presses = 0
  wait: Promise<unknown> | undefined

  run(action: ButtonAction) {
    this.presses++
    if (this.wait) {
      action.waitUntil(this.wait)
    }
  }
}

const el = (host: HTMLElement, id: string) =>
  host.querySelector<HTMLElement>(`#${id}`)!

describe("button", () => {
  test("a button gets type button unless the author wrote one", async () => {
    const { host } = await mount(Page)
    expect(el(host, "plain").getAttribute("type")).toBe("button")
    expect(el(host, "submit").getAttribute("type")).toBe("submit")
    expect(el(host, "link").hasAttribute("type")).toBe(false)
  })

  test("disabled disables a native button", async () => {
    const { host } = await mount(Page)
    expect((el(host, "off") as HTMLButtonElement).disabled).toBe(true)
  })

  test("a bare disabled leaves a focusable disabled button in the tab order", async () => {
    const { host } = await mount(Page)
    expect(el(host, "held").hasAttribute("disabled")).toBe(false)
    expect(el(host, "held").getAttribute("aria-disabled")).toBe("true")
  })

  test("(action) runs on a press, and waitUntil() keeps it pending", async () => {
    const { host, instance, settle } = await mount(Page)
    let finish = () => {}
    instance.wait = new Promise<void>((resolve) => (finish = resolve))
    el(host, "save").click()
    await settle()
    expect(instance.presses).toBe(1)
    expect(el(host, "save").getAttribute("aria-busy")).toBe("true")
    expect(el(host, "save").textContent?.trim()).toBe("Saving")
    el(host, "save").click()
    expect(instance.presses).toBe(1)
    finish()
    await new Promise((resolve) => setTimeout(resolve))
    await settle()
    expect(el(host, "save").hasAttribute("aria-busy")).toBe(false)
    expect(el(host, "save").textContent?.trim()).toBe("Save")
  })
})
