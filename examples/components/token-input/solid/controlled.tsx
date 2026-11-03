import { toText, TokenInput, TokenInputEditor, type TokenInputValue } from "@ui-sdk/solid/token-input"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuItem,
  TriggerMenuList,
} from "@ui-sdk/solid/trigger-menu"
import { For, createSignal } from "solid-js"

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

export function Example() {
  const [value, setValue] = createSignal<TokenInputValue>(draft)
  const [last, setLast] = createSignal("")
  return (
    <div data-slot="stack">
      <TokenInput
        value={value()}
        onValueChange={(next, details) => {
          setValue(next)
          const removed = details.removed.map((token) => token.label).join(", ")
          setLast(
            `${details.reason}${details.inputType ? ` (${details.inputType})` : ""}${removed ? `, removed ${removed}` : ""}`,
          )
        }}
        history={{ limit: 50, groupDelay: 1000 }}
        getTokenDescription={(token) => (token.type === "file" ? "attached file" : token.type)}
      >
        <TokenInputEditor aria-label="Prompt" />
        <TriggerMenu triggers={[{ char: "@", type: "file", items: files }]}>
          <TriggerMenuContent>
            <TriggerMenuList>
              {(state) => (
                <For each={state.items as TriggerMenuDataItem[]}>
                  {(item) => (
                    <TriggerMenuItem value={item.value} label={item.label} disabled={item.disabled}>
                      {item.label}
                    </TriggerMenuItem>
                  )}
                </For>
              )}
            </TriggerMenuList>
          </TriggerMenuContent>
        </TriggerMenu>
      </TokenInput>
      <p data-slot="output">{last() || "Type, paste or press Cmd+Z."}</p>
      <p data-slot="output">{toText(value())}</p>
    </div>
  )
}
