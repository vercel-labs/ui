import {
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenRemove,
} from "@ui-sdk/react/token-input"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuItem,
  TriggerMenuList,
} from "@ui-sdk/react/trigger-menu"
import { FileIcon, XIcon } from "lucide-react"

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
          <FileIcon aria-hidden="true" />
          {token.label}
          <TokenInputTokenRemove>
            <XIcon aria-hidden="true" />
          </TokenInputTokenRemove>
        </TokenInputToken>
      )}
    >
      <TokenInputEditor aria-label="Prompt" placeholder="Ask about a file, type @ to add one" />
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
  )
}
