import {
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  type TokenDeletion,
  type TokenInputValue,
} from "@ui-sdk/solid/token-input"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuItem,
  TriggerMenuList,
} from "@ui-sdk/solid/trigger-menu"
import { createSignal, For } from "solid-js"

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

const deletions = ["whole", "select", "revert"] as const

export function Example() {
  const [deletion, setDeletion] = createSignal<TokenDeletion>("whole")
  return (
    <div data-slot="stack">
      <div role="radiogroup" aria-label="Backspace" data-slot="row">
        <For each={deletions}>
          {(option) => (
            <label data-slot="label">
              <input
                type="radio"
                name="token-deletion"
                value={option}
                checked={deletion() === option}
                onChange={() => setDeletion(option)}
                data-slot="visually-hidden"
              />
              {option}
            </label>
          )}
        </For>
      </div>
      <TokenInput
        tokenDeletion={deletion()}
        defaultValue={draft}
        renderToken={(token) => <TokenInputToken>@{token.label}</TokenInputToken>}
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
    </div>
  )
}
