// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import {
  createLocalStorage,
  createPreference,
  type PreferenceLike,
} from "@ui-sdk/core"
import { createConfirm } from "@ui-sdk/core/dialog"
import { createOverlays } from "@ui-sdk/core/overlays"
import { createToaster } from "@ui-sdk/core/toast"
import { afterEach, describe, expect, test } from "vitest"
import { useAsyncOptions } from "../src/async-options"
import { OverlayHost, type OverlayHostToastProps } from "../src/overlays"
import { Preferences, usePreference } from "../src/preferences"
import { useShortcut, useShortcutHint } from "../src/shortcuts"
import { mount } from "./mount"

HTMLElement.prototype.showPopover ??= function () {}
HTMLElement.prototype.hidePopover ??= function () {}

const wait = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms))

afterEach(() => localStorage.clear())

const overlays = createOverlays()
const texts = (selector: string) =>
  [...document.querySelectorAll(selector)].map((el) => el.textContent).join()

@Component({
  selector: "test-root",
  imports: [OverlayHost],
  template: `<div
    uiOverlayHost
    [overlays]="overlays"
    [toast]="{ class: 'toasts' }"
  ></div>`,
})
class StyledHost {
  readonly overlays = overlays
}

@Component({
  selector: "test-root",
  imports: [OverlayHost],
  template: `<div uiOverlayHost [overlays]="overlays" [toast]="toast"></div>`,
})
class Host {
  readonly overlays = overlays
  readonly toast: OverlayHostToastProps | undefined = undefined
}

const skinTone = createPreference({
  values: ["default", "dark"],
  defaultValue: "default",
  attribute: "data-skin-tone",
  storage: createLocalStorage("skin-tone"),
})

@Component({
  selector: "test-root",
  imports: [Preferences],
  template: `
    <div uiPreferences id="prefs" [preferences]="list">
      <p id="tone">{{ tone().value }}</p>
    </div>
  `,
})
class Tones {
  readonly list: PreferenceLike[] = [skinTone]
  readonly tone = usePreference(skinTone)
}

@Component({
  selector: "test-root",
  template: `<kbd
    id="hint"
    [attr.aria-keyshortcuts]="hint.ariaKeyshortcuts()"
    >{{ hint.text() }}</kbd
  >`,
})
class Keys {
  readonly keys = signal<string | null>("mod+k")
  readonly pressed = signal(0)
  readonly hint = useShortcutHint(() => this.keys() ?? "")
  readonly options = useAsyncOptions(
    async (query) => ["Ada", "Grace"].filter((name) => name.includes(query)),
    { immediate: true }
  )

  constructor() {
    useShortcut(this.keys, () => this.pressed.update((count) => count + 1))
  }
}

const press = (init: KeyboardEventInit) =>
  document.body.dispatchEvent(
    new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init })
  )

describe("overlay host", () => {
  test("renders what confirm() asks and answers with the pressed close", async () => {
    await mount(Host)
    const confirm = createConfirm({ overlays })
    const answer = confirm({
      title: "Delete the file?",
      confirmLabel: "Delete",
    })
    await wait()
    const dialog = document.querySelector<HTMLElement>("[role=alertdialog]")!
    expect(dialog.textContent).toContain("Delete the file?")
    const [, agree] = dialog.querySelectorAll("button")
    agree!.click()
    expect(await answer).toBe(true)
  })

  test("renders a toaster's region", async () => {
    await mount(Host)
    createToaster({ overlays })("Sent")
    await wait()
    expect(texts("[data-slot=toast-region]")).toContain("Sent")
  })

  test("passes the toast props to the regions it renders", async () => {
    await mount(StyledHost)
    createToaster({ overlays })("Saved")
    await wait()
    expect(texts(".toasts[data-slot=toast-region]")).toContain("Saved")
  })
})

describe("preferences", () => {
  test("the element and usePreference show the saved value once the page renders", async () => {
    localStorage.setItem("skin-tone", "dark")
    const { host, settle } = await mount(Tones)
    await settle()
    expect(host.querySelector("#prefs")!.getAttribute("data-skin-tone")).toBe(
      "dark"
    )
    expect(host.querySelector("#tone")!.textContent).toBe("dark")
    expect(host.querySelector("script")).toBeNull()
  })
})

describe("shortcuts and async options", () => {
  test("a shortcut registers while its keys are set, and its hint formats them", async () => {
    const { host, instance, settle } = await mount(Keys)
    const hint = host.querySelector("#hint")!
    expect(hint.getAttribute("aria-keyshortcuts")).toBe("Control+K")
    expect(hint.textContent).toContain("Ctrl+K")
    press({ key: "k", ctrlKey: true })
    expect(instance.pressed()).toBe(1)
    instance.keys.set(null)
    await settle()
    press({ key: "k", ctrlKey: true })
    expect(instance.pressed()).toBe(1)
  })

  test("an immediate load starts once it renders, and setQuery loads again", async () => {
    const { instance } = await mount(Keys)
    await wait()
    expect(instance.options.state().items).toEqual(["Ada", "Grace"])
    instance.options.setQuery("Gr")
    await wait(400)
    expect(instance.options.state().items).toEqual(["Grace"])
  })
})
