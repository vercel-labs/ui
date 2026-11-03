import "@ui-sdk/web/menu"
import { Archive, Copy, createElement, Pencil, Trash } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-menu>
        <ui-menu-trigger>
          <button>Actions</button>
        </ui-menu-trigger>
        <ui-menu-content>
          <ui-menu-item value="edit">
            ${createElement(Pencil, { "aria-hidden": "true" }).outerHTML}
            Edit
          </ui-menu-item>
          <ui-menu-item value="duplicate">
            ${createElement(Copy, { "aria-hidden": "true" }).outerHTML}
            Duplicate
          </ui-menu-item>
          <ui-menu-item value="archive">
            ${createElement(Archive, { "aria-hidden": "true" }).outerHTML}
            Archive
          </ui-menu-item>
          <ui-menu-separator></ui-menu-separator>
          <ui-menu-item value="delete" destructive>
            ${createElement(Trash, { "aria-hidden": "true" }).outerHTML}
            Delete
          </ui-menu-item>
        </ui-menu-content>
      </ui-menu>
      <output data-slot="output">Pick an item</output>
    </div>
  `
  root.addEventListener(
    "action",
    (event) => {
      root.querySelector("output")!.textContent =
        `Ran ${(event as CustomEvent<{ value: string }>).detail.value}`
    },
    { capture: true },
  )
}
