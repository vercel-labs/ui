import "@ui-sdk/web/menu"
import { createElement, Download, Link, Mail, Reply, Share } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-menu>
        <ui-menu-trigger>
          <button>
            ${createElement(Share, { "aria-hidden": "true" }).outerHTML}
            Share
          </button>
        </ui-menu-trigger>
        <ui-menu-content>
          <ui-menu-item value="copy-link">
            <ui-menu-item-icon>
              ${createElement(Link, { "aria-hidden": "true" }).outerHTML}
            </ui-menu-item-icon>
            Copy link
          </ui-menu-item>
          <ui-menu-item value="email">
            <ui-menu-item-icon>
              ${createElement(Mail, { "aria-hidden": "true" }).outerHTML}
            </ui-menu-item-icon>
            Email
          </ui-menu-item>
          <ui-menu-item value="reply">
            <ui-menu-item-icon mirror>
              ${createElement(Reply, { "aria-hidden": "true" }).outerHTML}
            </ui-menu-item-icon>
            Reply
          </ui-menu-item>
          <ui-menu-separator></ui-menu-separator>
          <ui-menu-item value="download">
            <ui-menu-item-icon>
              ${createElement(Download, { "aria-hidden": "true" }).outerHTML}
            </ui-menu-item-icon>
            Download
          </ui-menu-item>
          <ui-menu-item value="embed">Embed</ui-menu-item>
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

export { mount }
