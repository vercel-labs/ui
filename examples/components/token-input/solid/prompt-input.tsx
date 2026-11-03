import {
  createTokenInputController,
  toText,
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenRemove,
  type TokenInputValue,
} from "@ui-sdk/solid/token-input"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuHint,
  TriggerMenuItem,
  TriggerMenuList,
} from "@ui-sdk/solid/trigger-menu"
import { createSignal, For, onCleanup, Show } from "solid-js"

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
const Check = icon('<path d="M20 6 9 17l-5-5" />')
const ChevronRight = icon('<path d="m9 18 6-6-6-6" />')
const Clock = icon('<circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />')
const Code = icon('<path d="m16 18 6-6-6-6" /><path d="m8 6-6 6 6 6" />')
const File = icon(
  '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" /><path d="M14 2v5a1 1 0 0 0 1 1h5" />',
)
const Plus = icon('<path d="M5 12h14" /><path d="M12 5v14" />')
const X = icon('<path d="M18 6 6 18" /><path d="m6 6 12 12" />')

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
  const prompt = createTokenInputController()
  const [sent, setSent] = createSignal<string[]>([])
  const [running, setRunning] = createSignal(false)
  let sendTimer: ReturnType<typeof setTimeout> | undefined

  onCleanup(() => clearTimeout(sendTimer))

  function send(value: TokenInputValue) {
    if (running() || !prompt.getLabel().trim()) return
    setRunning(true)
    const skillTokens = value.filter((segment) => typeof segment !== "string" && segment.type === "skill")
    for (const skill of skillTokens)
      if (typeof skill !== "string")
        prompt.updateToken(skill.id!, { data: { ...skill.data, run: "running" } })
    sendTimer = setTimeout(() => {
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
        <For each={sent()}>{(text) => <li>{text}</li>}</For>
      </ul>
      <TokenInput
        controller={prompt}
        onSubmit={send}
        renderToken={(token) => (
          <TokenInputToken>
            <Show when={token.type === "skill"} fallback={<File aria-hidden="true" />}>
              <Code aria-hidden="true" />
            </Show>
            {token.type === "skill" ? `/${token.label}` : token.label}
            <Show when={token.data?.run === "running"}>
              <Clock aria-hidden="true" />
            </Show>
            <Show when={token.data?.run === "done"}>
              <Check aria-hidden="true" />
            </Show>
            <TokenInputTokenRemove>
              <X aria-hidden="true" />
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
              <Plus aria-hidden="true" />
              README
            </button>
            <button
              type="button"
              onClick={() => send(prompt.getValue())}
              aria-label={running() ? "Running" : "Send"}
              disabled={running()}
            >
              <Show when={running()} fallback={<ChevronRight aria-hidden="true" />}>
                <Clock aria-hidden="true" />
              </Show>
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
