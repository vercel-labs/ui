import {
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenRemove,
} from "@ui-sdk/solid/token-input"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuItem,
  TriggerMenuList,
} from "@ui-sdk/solid/trigger-menu"
import { For } from "solid-js"

const icon = (markup: string) => () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    innerHTML={markup}
  />
)
const File = icon(
  '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" /><path d="M14 2v5a1 1 0 0 0 1 1h5" />',
)
const X = icon('<path d="M18 6 6 18" /><path d="m6 6 12 12" />')

const files = [
  { value: "src/app.tsx", label: "app.tsx", keywords: ["src"] },
  { value: "src/routes.ts", label: "routes.ts", keywords: ["src"] },
  { value: "src/styles.css", label: "styles.css", keywords: ["src"] },
  { value: "README.md", label: "README.md" },
  { value: "package.json", label: "package.json" },
]

export function Example() {
  return (
    <TokenInput
      renderToken={(token) => (
        <TokenInputToken>
          <File aria-hidden="true" />
          {token.label}
          <TokenInputTokenRemove>
            <X aria-hidden="true" />
          </TokenInputTokenRemove>
        </TokenInputToken>
      )}
    >
      <TokenInputEditor aria-label="Prompt" placeholder="Ask about a file, type @ to add one" />
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
  )
}
