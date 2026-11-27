// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import { Field, FieldLabel } from "../src/field"
import {
  createTriggerMenuController,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuInput,
  TriggerMenuList,
  type TriggerDefinition,
  type TriggerMenuSelect,
} from "../src/trigger-menu"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [
    Field,
    FieldLabel,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuEmpty,
    TriggerMenuInput,
    TriggerMenuList,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Message</label>
      <ng-container
        uiTriggerMenu
        [triggers]="triggers"
        [controller]="controller"
        [(open)]="open"
        (itemSelect)="chosen.set($event)"
      >
        <textarea uiTriggerMenuInput></textarea>
        <div *uiTriggerMenuContent id="content">
          <div uiTriggerMenuList id="list"></div>
          <div uiTriggerMenuEmpty id="empty">Nobody by that name</div>
        </div>
      </ng-container>
    </div>
  `,
})
class Page {
  readonly triggers: TriggerDefinition[] = [
    { char: "@", items: ["Ada", "Grace", { type: "separator" }, "Linus"] },
  ]
  readonly controller = createTriggerMenuController()
  readonly open = signal(false)
  readonly chosen = signal<TriggerMenuSelect<string> | undefined>(undefined)
}

const type = (field: HTMLTextAreaElement, text: string) => {
  field.value = text
  field.setSelectionRange(text.length, text.length)
  field.dispatchEvent(new InputEvent("input", { bubbles: true, data: text }))
}
const key = (target: HTMLElement, name: string) =>
  target.dispatchEvent(
    new KeyboardEvent("keydown", { key: name, bubbles: true, cancelable: true })
  )
const wait = () => new Promise((resolve) => setTimeout(resolve, 20))

describe("trigger menu", () => {
  test("its input is the field's control", async () => {
    const { host } = await mount(Page)
    const field = host.querySelector("textarea")!
    expect(field.getAttribute("aria-haspopup")).toBe("listbox")
    expect(host.querySelector("label")!.htmlFor).toBe(field.id)
    expect(document.querySelector("#content")).toBeNull()
  })

  // jsdom's events aren't trusted, so the controller types the trigger here.
  test("a trigger opens the list with its matches, and Enter emits the chosen one", async () => {
    const { host, instance, settle } = await mount(Page)
    const field = host.querySelector("textarea")!
    field.focus()
    void instance.controller.open()
    await wait()
    await settle()
    expect(instance.open()).toBe(true)
    const options = () =>
      [...document.querySelectorAll<HTMLElement>("[role=option]")].map(
        (option) => option.textContent?.trim()
      )
    expect(options()).toEqual(["Ada", "Grace", "Linus"])
    expect(
      document.querySelectorAll("#list [data-slot=trigger-menu-separator]")
    ).toHaveLength(1)
    type(field, "@gr")
    await wait()
    await settle()
    expect(options()).toEqual(["Grace"])
    key(field, "Enter")
    await wait()
    await settle()
    expect(instance.chosen()?.value).toBe("Grace")
    expect(instance.chosen()?.trigger).toBe("@")
    expect(field.value).toContain("Grace")
    expect(instance.open()).toBe(false)
  })
})
