import {
  createTokenInputController,
  TokenInput,
  TokenInputEditor,
  type TokenInputValue,
} from "@ui-sdk/react/token-input"
import * as React from "react"

const draft: TokenInputValue = [
  "Explain ",
  { type: "file", value: "src/routes.ts", label: "routes.ts" },
  " in two sentences.",
]

const loadFile = () => new Promise<void>((resolve) => setTimeout(resolve, 800))

export function Example() {
  const [prompt] = React.useState(createTokenInputController)

  return (
    <div data-slot="stack">
      <TokenInput controller={prompt} defaultValue={draft}>
        <TokenInputEditor aria-label="Prompt" />
      </TokenInput>
      <div data-slot="row" onMouseDown={(event) => event.preventDefault()}>
        <button
          type="button"

          onClick={() =>
            prompt.insert(
              { type: "file", value: "package.json", label: "package.json" },
              { at: "end", resolve: loadFile() },
            )
          }
        >
          Attach package.json
        </button>
        <button
          type="button"

          onClick={() => {
            const token = prompt.getValue().find((segment) => typeof segment !== "string")
            if (typeof token === "object") prompt.updateToken(token.id!, { label: token.label.toUpperCase() })
          }}
        >
          Rename first
        </button>
        <button
          type="button"

          onClick={() => {
            const token = prompt.getValue().find((segment) => typeof segment !== "string")
            if (typeof token === "object") prompt.removeToken(token.id!)
          }}
        >
          Remove first
        </button>
        <button
          type="button"

          onClick={() => prompt.canUndo() && prompt.undo()}
        >
          Undo
        </button>

        <button
          type="button"

          onClick={() => prompt.clear()}
        >
          Clear
        </button>
      </div>
    </div>
  )
}
