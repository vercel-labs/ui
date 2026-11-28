// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  Tree,
  type TreeAction,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
  TreeItems,
} from "../src/tree"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [Tree, TreeGroup, TreeItem, TreeItemIndicator, TreeItemLabel],
  template: `
    <div
      uiTree
      id="tree"
      aria-label="Files"
      [(value)]="value"
      [(expanded)]="expanded"
      (action)="ran.set($event)"
    >
      <div uiTreeItem id="src" value="src">
        <span uiTreeItemIndicator id="src-arrow"></span>
        <span uiTreeItemLabel>src</span>
        <div *uiTreeGroup id="src-group">
          <div uiTreeItem id="index" value="src/index.ts">
            <span uiTreeItemLabel>index.ts</span>
          </div>
        </div>
      </div>
      <div uiTreeItem id="readme" value="README.md">
        <span uiTreeItemLabel>README.md</span>
      </div>
    </div>
  `,
})
class Parts {
  readonly value = signal<string | null>(null)
  readonly expanded = signal<string[]>([])
  readonly ran = signal<TreeAction | null>(null)
}

@Component({
  selector: "test-root",
  imports: [Tree, TreeItems],
  template: `
    <div
      uiTree
      checkable
      aria-label="Files"
      [paths]="paths"
      [defaultExpanded]="['src']"
      [(checked)]="checked"
    >
      <div uiTreeItems></div>
    </div>
  `,
})
class Data {
  readonly paths = ["src/index.ts", "README.md"]
  readonly checked = signal<string[]>([])
}

const byId = (id: string) => document.getElementById(id)!
const press = (el: Element) => (el as HTMLElement).click()

describe("tree", () => {
  test("a group makes its item a branch, which expands and selects", async () => {
    const { instance, settle } = await mount(Parts)
    expect(byId("tree").getAttribute("role")).toBe("tree")
    expect(byId("src").getAttribute("role")).toBe("treeitem")
    expect(byId("src").getAttribute("aria-expanded")).toBe("false")
    expect(byId("readme").hasAttribute("aria-expanded")).toBe(false)
    expect(document.getElementById("src-group")).toBeNull()

    press(byId("src-arrow"))
    await settle()
    expect(instance.expanded()).toEqual(["src"])
    expect(byId("src").getAttribute("aria-expanded")).toBe("true")
    expect(byId("src-group").getAttribute("role")).toBe("group")
    expect(byId("index").getAttribute("aria-level")).toBe("2")

    press(byId("index"))
    await settle()
    expect(instance.value()).toBe("src/index.ts")
    expect(byId("index").getAttribute("aria-selected")).toBe("true")
    expect(instance.ran()?.value).toBe("src/index.ts")

    instance.expanded.set([])
    await settle()
    expect(document.getElementById("src-group")).toBeNull()
  })

  test("renders a data tree from paths, with checkboxes", async () => {
    const { instance, settle } = await mount(Data)
    const items = [...document.querySelectorAll("[role=treeitem]")]
    expect(items.map((item) => item.getAttribute("aria-level"))).toEqual([
      "1",
      "2",
      "1",
    ])
    const labels = [...document.querySelectorAll("[data-slot=tree-label]")]
    expect(labels.map((label) => label.textContent)).toEqual([
      "src",
      "index.ts",
      "README.md",
    ])

    press(document.querySelector("[data-slot=tree-checkbox]")!)
    await settle()
    expect(instance.checked()).toContain("src/index.ts")
    expect(items[0].getAttribute("aria-checked")).toBe("true")
  })
})
