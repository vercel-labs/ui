import {
  fromText,
  toText,
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenRemove,
} from "@ui-sdk/solid/token-input"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuHint,
  TriggerMenuItem,
  TriggerMenuList,
} from "@ui-sdk/solid/trigger-menu"
import { render } from "@solidjs/web"
import { createSignal, For, Show } from "solid-js"
import {
  pendingSelect,
  tokenInputFixture as f,
  tokenInputOptions,
  tokenTriggers,
} from "tests/fixtures/token-input.ts"

function Fixture() {
  const { value, pending, fail, form, otherForm, controlled, ...options } =
    tokenInputOptions()
  const [action, setAction] = createSignal("")
  const [submitted, setSubmitted] = createSignal("")
  const triggers = tokenTriggers()
  const initial = fromText(value)
  const [current, setCurrent] = createSignal(initial)
  return (
    <div class="fixture">
      <button>Before</button>
      <form
        class="composer"
        aria-label={f.formLabel}
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(String(new FormData(event.currentTarget).get(f.name)))
        }}
      >
        <TokenInput
          {...options}
          name={f.name}
          form={otherForm ? "other" : undefined}
          defaultValue={controlled ? undefined : initial}
          value={controlled ? current() : undefined}
          onValueChange={(next, details) => {
            setCurrent(next)
            setAction(`${details.reason}:${toText(next)}`)
          }}
          onSubmit={form ? undefined : (next) => setSubmitted(toText(next))}
          renderToken={(token) => (
            <TokenInputToken class="token">
              {token.label}
              <TokenInputTokenRemove> ×</TokenInputTokenRemove>
            </TokenInputToken>
          )}
        >
          <label class="label" id="prompt-label">
            {f.label}
          </label>
          <TokenInputEditor
            aria-labelledby="prompt-label"
            class="editor"
            placeholder={f.placeholder}
          />
          <TriggerMenu
            triggers={triggers}
            onSelect={(_selected, details) =>
              pending && details.trigger === "@"
                ? pendingSelect({ fail })
                : undefined
            }
          >
            <TriggerMenuHint class="hint" />
            <TriggerMenuContent class="popup list-popup">
              <TriggerMenuList>
                {(state) => (
                  <For each={state.items as TriggerMenuDataItem[]}>
                    {(item) => (
                      <TriggerMenuItem
                        value={item.value}
                        label={item.label}
                        disabled={item.disabled}
                        class="item"
                      >
                        {item.label}
                      </TriggerMenuItem>
                    )}
                  </For>
                )}
              </TriggerMenuList>
            </TriggerMenuContent>
          </TriggerMenu>
        </TokenInput>
        <button type="submit">{f.submit}</button>
      </form>
      <Show when={otherForm}>
        <form
          id="other"
          aria-label="Other"
          onSubmit={(event) => {
            event.preventDefault()
            setSubmitted(
              `other:${new FormData(event.currentTarget).get(f.name)}`
            )
          }}
        />
      </Show>
      <textarea aria-label={f.scratch} />
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <output role="status" aria-label="Submitted">
        {submitted()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
