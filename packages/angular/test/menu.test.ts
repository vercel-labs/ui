// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import type { MenuData } from "@ui-sdk/core/menu"
import { describe, expect, test } from "vitest"
import {
  Menu,
  type MenuAction,
  MenuCheckboxItem,
  type MenuCheckedChange,
  MenuContent,
  MenuContextTrigger,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuItemIndicator,
  MenuItems,
  MenuRadioGroup,
  MenuRadioItem,
  MenuShortcut,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "../src/menu"
import { Menubar } from "../src/menubar"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [
    Menu,
    MenuTrigger,
    MenuContextTrigger,
    MenuContent,
    MenuItem,
    MenuShortcut,
    MenuCheckboxItem,
    MenuItemIndicator,
    MenuRadioGroup,
    MenuRadioItem,
    MenuGroup,
    MenuGroupLabel,
    MenuSub,
    MenuSubTrigger,
    MenuSubContent,
  ],
  template: `
    <ng-container
      uiMenu
      (action)="run($event)"
      (checkedChange)="toggled($event)"
    >
      <button uiMenuTrigger id="trigger">File</button>
      <div uiMenuContextTrigger id="area">Right-click here</div>
      <div *uiMenuContent id="content">
        <div uiMenuGroup id="group">
          <div uiMenuGroupLabel id="group-label">Document</div>
          <div uiMenuItem id="new" value="new" shortcut="mod+n">
            New <span uiMenuShortcut id="new-keys"></span>
          </div>
          <div
            uiMenuItem
            id="slow"
            value="slow"
            (select)="selected.push('slow')"
          >
            Slow
          </div>
        </div>
        <div uiMenuCheckboxItem id="wrap" value="wrap" [(checked)]="wrap">
          Wrap <span *uiMenuItemIndicator id="wrap-check">✓</span>
        </div>
        <div uiMenuRadioGroup id="sizes" name="size" [(value)]="size">
          <div uiMenuRadioItem id="small" value="small">
            Small <span *uiMenuItemIndicator class="dot">•</span>
          </div>
          <div uiMenuRadioItem id="large" value="large">
            Large <span *uiMenuItemIndicator class="dot">•</span>
          </div>
        </div>
        <ng-container uiMenuSub>
          <div uiMenuSubTrigger id="more">More</div>
          <div *uiMenuSubContent id="more-content">
            <div uiMenuItem id="export" value="export">Export</div>
          </div>
        </ng-container>
      </div>
    </ng-container>
  `,
})
class Page {
  readonly wrap = signal(false)
  readonly size = signal<string | null>("small")
  readonly actions: string[] = []
  readonly selected: string[] = []
  readonly checks: string[] = []
  wait: Promise<unknown> | undefined

  run(action: MenuAction) {
    this.actions.push(action.value)
    if (this.wait) {
      action.waitUntil(this.wait)
    }
  }

  toggled(change: MenuCheckedChange) {
    this.checks.push(`${change.value}:${change.checked}`)
  }
}

@Component({
  selector: "test-root",
  imports: [Menubar, Menu, MenuTrigger, MenuContent, MenuItems],
  template: `
    <div uiMenubar id="bar">
      <ng-container uiMenu [items]="file" (action)="actions.push($event.value)">
        <button uiMenuTrigger id="file">File</button>
        <div *uiMenuContent id="file-content">
          <div uiMenuItems id="file-items"></div>
        </div>
      </ng-container>
      <ng-container uiMenu [items]="edit">
        <button uiMenuTrigger id="edit">Edit</button>
        <div *uiMenuContent id="edit-content"><div uiMenuItems></div></div>
      </ng-container>
    </div>
  `,
})
class Bar {
  readonly file: MenuData = [
    { value: "new", label: "New", shortcut: "mod+n" },
    { type: "separator" },
    { type: "checkbox", value: "autosave", label: "Autosave" },
    {
      type: "submenu",
      label: "Recent",
      items: ["report.md", "notes.md"],
    },
  ]
  readonly edit: MenuData = ["Undo", "Redo"]
  readonly actions: string[] = []
}

// Without a top layer, as in jsdom, an open menu renders at the end of the body.
const page = document
const find = (id: string) => page.querySelector<HTMLElement>(`#${id}`)!
const press = (id: string) => find(id).click()

@Component({
  selector: "test-root",
  imports: [Menu, MenuContent, MenuRadioGroup, MenuRadioItem],
  template: `
    <ng-container uiMenu [(open)]="open">
      <div *uiMenuContent>
        <div uiMenuRadioGroup defaultValue="light">
          <div uiMenuRadioItem value="light">Light</div>
          <div uiMenuRadioItem id="dark" value="dark">Dark</div>
        </div>
      </div>
    </ng-container>
  `,
})
class Theme {
  readonly open = signal(true)
}

describe("menu", () => {
  test("the trigger opens a menu of items, with groups named by their labels", async () => {
    const { settle } = await mount(Page)
    expect(page.querySelector("#content")).toBeNull()
    press("trigger")
    await settle()
    expect(find("content").getAttribute("role")).toBe("menu")
    expect(find("new").getAttribute("role")).toBe("menuitem")
    expect(find("group").getAttribute("aria-labelledby")).toBe(
      find("group-label").id
    )
    expect(find("new").getAttribute("aria-keyshortcuts")).toBe("Control+N")
    expect(find("new-keys").textContent).toContain("Ctrl+N")
    expect(find("trigger").getAttribute("aria-expanded")).toBe("true")
  })

  test("an item runs its (select), then the menu's (action), and closes the menu", async () => {
    const { instance, settle } = await mount(Page)
    press("trigger")
    await settle()
    press("slow")
    await settle()
    expect(instance.selected).toEqual(["slow"])
    expect(instance.actions).toEqual(["slow"])
    expect(page.querySelector("#content")).toBeNull()
  })

  test("waitUntil() keeps the item pending and the menu open until the promise settles", async () => {
    const { instance, settle } = await mount(Page)
    let finish = () => {}
    instance.wait = new Promise<void>((resolve) => (finish = resolve))
    press("trigger")
    await settle()
    press("new")
    await settle()
    expect(find("new").getAttribute("aria-busy")).toBe("true")
    finish()
    await new Promise((resolve) => setTimeout(resolve))
    await settle()
    expect(page.querySelector("#content")).toBeNull()
  })

  test("a checkbox item toggles with [(checked)], and its indicator shows while checked", async () => {
    const { instance, settle } = await mount(Page)
    press("trigger")
    await settle()
    expect(find("wrap").getAttribute("role")).toBe("menuitemcheckbox")
    expect(page.querySelector("#wrap-check")).toBeNull()
    press("wrap")
    await settle()
    expect(instance.wrap()).toBe(true)
    expect(instance.checks).toEqual(["wrap:true"])
    expect(find("wrap").getAttribute("aria-checked")).toBe("true")
    expect(page.querySelector("#wrap-check")).not.toBeNull()
  })

  test("a radio group selects one item with [(value)]", async () => {
    const { instance, settle } = await mount(Page)
    press("trigger")
    await settle()
    expect(find("small").getAttribute("aria-checked")).toBe("true")
    expect(find("small").querySelector(".dot")).not.toBeNull()
    press("large")
    await settle()
    expect(instance.size()).toBe("large")
    expect(find("large").getAttribute("aria-checked")).toBe("true")
    expect(find("small").querySelector(".dot")).toBeNull()
  })

  test("an unnamed radio group keeps its choice after the menu closes", async () => {
    const { instance, settle } = await mount(Theme)
    press("dark")
    await settle()
    expect(find("dark").getAttribute("aria-checked")).toBe("true")
    instance.open.set(false)
    await settle()
    await new Promise((resolve) => setTimeout(resolve, 20))
    await settle()
    expect(document.querySelector("#dark")).toBeNull()
    instance.open.set(true)
    await settle()
    expect(find("dark").getAttribute("aria-checked")).toBe("true")
  })

  test("a submenu opens from its trigger, inside the menu's content", async () => {
    const { instance, settle } = await mount(Page)
    press("trigger")
    await settle()
    expect(find("more").getAttribute("aria-haspopup")).toBe("menu")
    press("more")
    await settle()
    expect(find("more-content").closest("#content")).not.toBeNull()
    press("export")
    await settle()
    expect(instance.actions).toEqual(["export"])
    expect(page.querySelector("#content")).toBeNull()
  })

  test("a right-click on the context area opens the menu", async () => {
    const { settle } = await mount(Page)
    find("area").dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: 40,
        clientY: 60,
      })
    )
    await settle()
    expect(find("content").getAttribute("role")).toBe("menu")
  })
})

describe("a data menu in a menubar", () => {
  test("uiMenuItems renders the menu's items, submenus included", async () => {
    const { instance, settle } = await mount(Bar)
    expect(find("bar").getAttribute("role")).toBe("menubar")
    expect(find("file").getAttribute("role")).toBe("menuitem")
    press("file")
    await settle()
    const content = find("file-content")
    const items = [...content.querySelectorAll("[role^=menuitem]")].map(
      (item) => item.textContent?.trim().replace(/\s+/g, " ")
    )
    expect(items[0]).toContain("New")
    expect(items[0]).toContain("Ctrl+N")
    expect(items.slice(1)).toEqual(["Autosave", "Recent"])
    expect(content.querySelector("[role=separator]")).not.toBeNull()
    content.querySelector<HTMLElement>("[role=menuitem]")!.click()
    await settle()
    expect(instance.actions).toEqual(["new"])
  })

  test("arrow keys move between the menubar's triggers", async () => {
    const { settle } = await mount(Bar)
    find("file").focus()
    find("file").dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
    )
    await settle()
    expect(page.activeElement?.id).toBe("edit")
  })
})
