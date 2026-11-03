import {
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  type TokenDeletion,
  type TokenInputValue,
} from "@ui-sdk/react/token-input"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuItem,
  TriggerMenuList,
} from "@ui-sdk/react/trigger-menu"
import * as React from "react"

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

export function Example() {
  const [deletion, setDeletion] = React.useState<TokenDeletion>("whole")
  return (
    <div data-slot="stack">
      <div role="radiogroup" aria-label="Backspace" data-slot="row">
        {(["whole", "select", "revert"] as const).map((option) => (
          <label key={option} data-slot="label">
            <input
              type="radio"
              name="token-deletion"
              value={option}
              checked={deletion === option}
              onChange={() => setDeletion(option)}
              data-slot="visually-hidden"
            />
            {option}
          </label>
        ))}
      </div>
      <TokenInput
        tokenDeletion={deletion}
        defaultValue={draft}
        renderToken={(token) => <TokenInputToken>@{token.label}</TokenInputToken>}
      >
        <TokenInputEditor aria-label="Prompt" />
        <TriggerMenu triggers={[{ char: "@", type: "file", items: files }]}>
          <TriggerMenuContent>
            <TriggerMenuList>
              {(state) =>
                (state.items as TriggerMenuDataItem[]).map((item) => (
                  <TriggerMenuItem
                    key={item.value}
                    value={item.value}
                    label={item.label}
                    disabled={item.disabled}
                  >
                    {item.label}
                  </TriggerMenuItem>
                ))
              }
            </TriggerMenuList>
          </TriggerMenuContent>
        </TriggerMenu>
      </TokenInput>
    </div>
  )
}
