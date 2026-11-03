import { toText, type TokenInputValue } from "@ui-sdk/core/token-input"
import "@ui-sdk/web/token-input"

const draft: TokenInputValue = [
  "Explain ",
  { type: "file", value: "src/routes.ts", label: "routes.ts" },
  " in two sentences.",
]

const loadFile = () => new Promise<void>((resolve) => setTimeout(resolve, 800))

export function mount(root: HTMLElement) {
  const actions = ["Attach package.json", "Rename first", "Remove first", "Undo", "Clear"]
  root.innerHTML = `
    <div data-slot="stack">
      <ui-token-input value="${toText(draft).replaceAll('"', "&quot;")}">
        <ui-token-input-editor aria-label="Prompt"></ui-token-input-editor>
      </ui-token-input>
      <div data-slot="row">
        ${actions.map((action) => `<button type="button">${action}</button>`).join("")}
      </div>
    </div>
  `
  const input = root.querySelector("ui-token-input")!
  const { api } = input
  const first = () => api.getValue().find((segment) => typeof segment !== "string")
  const run: Record<string, () => void> = {
    "Attach package.json": () =>
      api.insert(
        { type: "file", value: "package.json", label: "package.json" },
        { at: "end", resolve: loadFile() },
      ),
    "Rename first": () => {
      const token = first()
      if (typeof token === "object") api.updateToken(token.id!, { label: token.label.toUpperCase() })
    },
    "Remove first": () => {
      const token = first()
      if (typeof token === "object") api.removeToken(token.id!)
    },
    Undo: () => api.canUndo() && api.undo(),
    Clear: () => api.clear(),
  }
  for (const button of root.querySelectorAll("button")) {
    button.addEventListener("mousedown", (event) => event.preventDefault())
    button.addEventListener("click", () => run[button.textContent!]())
  }
}
