import {
  createTokenInputController,
  toText,
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenRemove,
  type TokenInputValue,
} from "@ui-sdk/react/token-input"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuHint,
  TriggerMenuItem,
  TriggerMenuList,
} from "@ui-sdk/react/trigger-menu"
import { CheckIcon, ChevronRightIcon, ClockIcon, CodeIcon, FileIcon, PlusIcon, XIcon } from "lucide-react"
import * as React from "react"

const files = [
  { value: "src/app.tsx", label: "app.tsx", keywords: ["src"] },
  { value: "src/routes.ts", label: "routes.ts", keywords: ["src"] },
  { value: "src/styles.css", label: "styles.css", keywords: ["src"] },
  { value: "README.md", label: "README.md" },
  { value: "package.json", label: "package.json" },
]

const skills = [
  { value: "search", label: "search", arguments: [{ name: "query", hint: "<query>", required: true }] },
  { value: "review", label: "review" },
  { value: "summarize", label: "summarize" },
]

const loadFile = () => new Promise<void>((resolve) => setTimeout(resolve, 800))

export function Example() {
  const [prompt] = React.useState(createTokenInputController)
  const [sent, setSent] = React.useState<string[]>([])
  const [running, setRunning] = React.useState(false)
  const sendTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  React.useEffect(() => () => clearTimeout(sendTimer.current), [])

  function send(value: TokenInputValue) {
    if (running || !prompt.getLabel().trim()) return
    setRunning(true)
    const skillTokens = value.filter((segment) => typeof segment !== "string" && segment.type === "skill")
    for (const skill of skillTokens)
      if (typeof skill !== "string")
        prompt.updateToken(skill.id!, { data: { ...skill.data, run: "running" } })
    sendTimer.current = setTimeout(() => {
      for (const skill of skillTokens)
        if (typeof skill !== "string") prompt.updateToken(skill.id!, { data: { ...skill.data, run: "done" } })
      setSent((list) => [...list, toText(prompt.getValue())])
      prompt.clear()
      setRunning(false)
    }, 1500)
  }

  return (
    <div data-slot="stack">
      <ul>
        {sent.map((text, index) => (
          <li key={index}>{text}</li>
        ))}
      </ul>
      <TokenInput
        controller={prompt}
        onSubmit={send}
        renderToken={(token) => (
          <TokenInputToken>
            {token.type === "skill" ? <CodeIcon aria-hidden="true" /> : <FileIcon aria-hidden="true" />}
            {token.type === "skill" ? `/${token.label}` : token.label}
            {token.data?.run === "running" && <ClockIcon aria-hidden="true" />}
            {token.data?.run === "done" && <CheckIcon aria-hidden="true" />}
            <TokenInputTokenRemove>
              <XIcon aria-hidden="true" />
            </TokenInputTokenRemove>
          </TokenInputToken>
        )}
      >
        <div data-slot="card">
          <TokenInputEditor aria-label="Prompt" placeholder="Ask anything. @ adds a file, / runs a skill" />
          <div data-slot="row">
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() =>
                prompt.insert(
                  { type: "file", value: "README.md", label: "README.md" },
                  { resolve: loadFile() },
                )
              }
            >
              <PlusIcon aria-hidden="true" />
              README
            </button>
            <button
              type="button"
              onClick={() => send(prompt.getValue())}
              aria-label={running ? "Running" : "Send"}
              disabled={running}
            >
              {running ? <ClockIcon aria-hidden="true" /> : <ChevronRightIcon aria-hidden="true" />}
            </button>
          </div>
        </div>
        <TriggerMenu
          triggers={[
            { char: "@", type: "file", items: files },
            { char: "/", boundary: "start", type: "skill", items: skills },
          ]}
          onSelect={(value, details) => (details.trigger === "@" ? loadFile() : undefined)}
        >
          <TriggerMenuHint />
          <TriggerMenuContent>
            <TriggerMenuEmpty>No matches</TriggerMenuEmpty>
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
