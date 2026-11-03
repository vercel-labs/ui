import "@ui-sdk/web/token-input"
import "@ui-sdk/web/trigger-menu"
import { createElement, File, X } from "lucide"

const files = [
  { value: "src/app.tsx", label: "app.tsx", keywords: ["src"] },
  { value: "src/routes.ts", label: "routes.ts", keywords: ["src"] },
  { value: "src/styles.css", label: "styles.css", keywords: ["src"] },
  { value: "README.md", label: "README.md" },
  { value: "package.json", label: "package.json" },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-token-input>
      <ui-token-input-editor aria-label="Prompt" placeholder="Ask about a file, type @ to add one"></ui-token-input-editor>
      <template>
        <ui-token-input-token>
          ${createElement(File, { "aria-hidden": "true" }).outerHTML}
          <span data-token-label></span>
          <ui-token-input-token-remove>${createElement(X, { "aria-hidden": "true" }).outerHTML}</ui-token-input-token-remove>
        </ui-token-input-token>
      </template>
      <ui-trigger-menu>
        <ui-trigger-menu-content>
          <ui-trigger-menu-list></ui-trigger-menu-list>
        </ui-trigger-menu-content>
        <template>
          <ui-trigger-menu-item>
          </ui-trigger-menu-item>
        </template>
      </ui-trigger-menu>
    </ui-token-input>
  `
  const menu = root.querySelector("ui-trigger-menu")!
  menu.triggers = [{ char: "@", type: "file", items: files }]
}
