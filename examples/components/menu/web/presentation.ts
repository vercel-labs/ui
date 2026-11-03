import "@ui-sdk/web/menu"
import { ChevronRight, createElement, Download, Link, Share, Trash } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-menu presentation="sheet">
        <ui-menu-trigger>
          <button>Options</button>
        </ui-menu-trigger>
        <ui-menu-content>
          <ui-menu-item value="share">
            ${createElement(Share, { "aria-hidden": "true" }).outerHTML}
            Share
          </ui-menu-item>
          <ui-menu-item value="copy-link">
            ${createElement(Link, { "aria-hidden": "true" }).outerHTML}
            Copy link
          </ui-menu-item>
          <ui-menu-sub>
            <ui-menu-sub-trigger>
              ${createElement(Download, { "aria-hidden": "true" }).outerHTML}
              Move to
              ${createElement(ChevronRight, { "aria-hidden": "true" }).outerHTML}
            </ui-menu-sub-trigger>
            <ui-menu-sub-content>
              <ui-menu-item value="inbox">Inbox</ui-menu-item>
              <ui-menu-item value="archive">Archive</ui-menu-item>
            </ui-menu-sub-content>
          </ui-menu-sub>
          <ui-menu-separator></ui-menu-separator>
          <ui-menu-item value="delete" destructive>
            ${createElement(Trash, { "aria-hidden": "true" }).outerHTML}
            Delete
          </ui-menu-item>
        </ui-menu-content>
      </ui-menu>
      <output data-slot="output">Opens as a sheet</output>
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

export { mount }
