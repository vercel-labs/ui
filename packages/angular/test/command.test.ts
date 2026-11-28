// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  Command,
  type CommandAction,
  type CommandData,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItems,
  CommandItemText,
  CommandList,
  CommandPage,
  CommandShortcut,
} from "../src/command"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [
    Command,
    CommandEmpty,
    CommandGroup,
    CommandGroupLabel,
    CommandInput,
    CommandItem,
    CommandItemText,
    CommandList,
    CommandPage,
    CommandShortcut,
  ],
  template: `
    <div uiCommand id="command" (action)="ran.set($event)" [(pages)]="pages">
      <input uiCommandInput id="input" aria-label="Search commands" />
      <div uiCommandList id="list">
        <ng-container *uiCommandPage>
          <div uiCommandGroup id="group">
            <div uiCommandGroupLabel>File</div>
            <div uiCommandItem id="copy" value="copy" shortcut="mod+c">
              <span uiCommandItemText id="copy-text">Copy</span>
              <kbd uiCommandShortcut id="copy-keys"></kbd>
            </div>
            <div uiCommandItem id="paste" value="paste">Paste</div>
          </div>
          <div uiCommandItem id="theme" value="theme" page="theme">Theme</div>
        </ng-container>
        <ng-container *uiCommandPage="'theme'">
          <div uiCommandItem id="dark" value="dark">Dark</div>
        </ng-container>
      </div>
      <div uiCommandEmpty id="empty">No command found</div>
    </div>
  `,
})
class Parts {
  readonly ran = signal<CommandAction | null>(null)
  readonly pages = signal<string[]>([])
}

@Component({
  selector: "test-root",
  imports: [Command, CommandInput, CommandItems, CommandList],
  template: `
    <div uiCommand [items]="items" (action)="ran.set($event.value)">
      <input uiCommandInput id="input" aria-label="Search commands" />
      <div uiCommandList id="list"><div uiCommandItems></div></div>
    </div>
  `,
})
class Data {
  readonly items: CommandData = [
    "Open",
    {
      type: "group",
      label: "Edit",
      items: [{ value: "undo", label: "Undo", shortcut: "mod+z" }],
    },
  ]
  readonly ran = signal<string | null>(null)
}

const byId = (id: string) => document.getElementById(id)!
const type = (input: HTMLInputElement, value: string) => {
  input.focus()
  input.value = value
  input.dispatchEvent(new InputEvent("input", { bubbles: true }))
}
const shown = () => [
  ...document.querySelectorAll("#list [role=option]:not([hidden])"),
]
const options = () => shown().map((option) => option.id)
const labels = () => shown().map((option) => option.textContent?.trim())

describe("command", () => {
  test("filters commands, marks the match and runs one", async () => {
    const { instance, settle } = await mount(Parts)
    expect(byId("input").getAttribute("role")).toBe("combobox")
    expect(options()).toEqual(["copy", "paste", "theme"])
    expect(byId("copy-keys").textContent).toContain("C")
    expect(byId("copy").getAttribute("aria-keyshortcuts")).toBeTruthy()

    type(byId("input") as HTMLInputElement, "cop")
    await settle()
    expect(options()).toEqual(["copy"])
    expect(byId("copy-text").innerHTML).toBe("<mark>Cop</mark>y")

    byId("copy").click()
    await settle()
    expect(instance.ran()?.value).toBe("copy")

    type(byId("input") as HTMLInputElement, "zzz")
    await settle()
    expect(options()).toEqual([])
    expect(byId("empty").textContent).toBe("No command found")
  })

  test("a command with a page opens it", async () => {
    const { instance, settle } = await mount(Parts)
    expect(document.getElementById("dark")).toBeNull()
    byId("theme").click()
    await settle()
    expect(instance.pages()).toEqual(["theme"])
    expect(options()).toEqual(["dark"])
    expect(document.getElementById("copy")).toBeNull()

    instance.pages.set([])
    await settle()
    expect(options()).toEqual(["copy", "paste", "theme"])
  })

  test("renders data commands and runs one", async () => {
    const { instance, settle } = await mount(Data)
    expect(labels()).toEqual(["Open", "Undo"])
    expect(
      document.querySelector("#list [role=option][aria-keyshortcuts]")
    ).not.toBeNull()

    type(byId("input") as HTMLInputElement, "und")
    await settle()
    expect(labels()).toEqual(["Undo"])
    byId("input").dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
    )
    await settle()
    expect(instance.ran()).toBe("undo")
  })
})
