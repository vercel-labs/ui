import type { TokenInputValue } from "@ui-sdk/core/token-input"
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
  { type: "file", value: "src/routes.ts", label: "routes.ts", data: { trigger: "@" } },
  " in two sentences.",
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div role="radiogroup" aria-label="Backspace" data-slot="row">
        ${["whole", "select", "revert"]
          .map(
            (option) =>
              `<label data-slot="label"><input type="radio" name="token-deletion" value="${option}" ${option === "whole" ? "checked" : ""} data-slot="visually-hidden" />${option}</label>`,
          )
          .join("")}
      </div>
    </div>
  `
  const input = document.createElement("ui-token-input")
  input.setAttribute("token-deletion", "whole")
  input.defaultValue = draft
  input.innerHTML = `
    <ui-token-input-editor aria-label="Prompt"></ui-token-input-editor>
    <template><ui-token-input-token>@<span data-token-label></span></ui-token-input-token></template>
    <ui-trigger-menu>
      <template>
        <ui-trigger-menu-content>
          <ui-trigger-menu-item>
          </ui-trigger-menu-item>
        </ui-trigger-menu-content>
      </template>
    </ui-trigger-menu>
  `
  root.firstElementChild!.append(input)
  const menu = input.querySelector("ui-trigger-menu")!
  menu.triggers = [{ char: "@", type: "file", items: files }]
  for (const radio of root.querySelectorAll<HTMLInputElement>('input[type="radio"]'))
    radio.addEventListener("change", () => input.setAttribute("token-deletion", radio.value))
}
