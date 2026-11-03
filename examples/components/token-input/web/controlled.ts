import { toText, type Token, type TokenInputValue } from "@ui-sdk/core/token-input"
import "@ui-sdk/web/token-input"
import "@ui-sdk/web/trigger-menu"

const files = [
  { value: "src/app.tsx", label: "app.tsx", keywords: ["src"] },
  { value: "src/routes.ts", label: "routes.ts", keywords: ["src"] },
  { value: "src/styles.css", label: "styles.css", keywords: ["src"] },
  { value: "README.md", label: "README.md" },
  { value: "package.json", label: "package.json" },
]

const draft: TokenInputValue = [
  "Explain ",
  { type: "file", value: "src/routes.ts", label: "routes.ts" },
  " in two sentences.",
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <p data-show="last" data-slot="output">Type, paste or press Cmd+Z.</p>
      <p data-show="text" data-slot="output"></p>
    </div>
  `
  const input = document.createElement("ui-token-input")
  input.history = { limit: 50, groupDelay: 1000 }
  input.describeToken = (token: Token) => (token.type === "file" ? "attached file" : token.type)
  input.defaultValue = draft
  input.innerHTML = `
    <ui-token-input-editor aria-label="Prompt"></ui-token-input-editor>
    <ui-trigger-menu>
      <template>
        <ui-trigger-menu-content>
          <ui-trigger-menu-item>
          </ui-trigger-menu-item>
        </ui-trigger-menu-content>
      </template>
    </ui-trigger-menu>
  `
  root.firstElementChild!.prepend(input)
  const menu = input.querySelector("ui-trigger-menu")!
  menu.triggers = [{ char: "@", type: "file", items: files }]
  root.querySelector('[data-show="text"]')!.textContent = toText(input.value)
  input.addEventListener("valuechange", (event) => {
    const { reason, inputType, removed, value } = event.detail
    const names = removed.map((token) => token.label).join(", ")
    root.querySelector('[data-show="last"]')!.textContent =
      `${reason}${inputType ? ` (${inputType})` : ""}${names ? `, removed ${names}` : ""}`
    root.querySelector('[data-show="text"]')!.textContent = toText(value)
  })
}
