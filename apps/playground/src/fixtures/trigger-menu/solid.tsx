import { Textarea } from "@ui-sdk/solid/textarea"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuHint,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuList,
  TriggerMenuStatus,
} from "@ui-sdk/solid/trigger-menu"
import { render } from "@solidjs/web"
import { createSignal, createUniqueId, For, Show } from "solid-js"
import {
  fixtureTriggers,
  selectAction,
  triggerMenuFixture as f,
  triggerMenuOptions,
} from "tests/fixtures/trigger-menu.ts"

function Composer(props: {
  name: string
  onAction: (action: string) => void
  onOpen: (open: string) => void
}) {
  const { input, textarea, empty, autoHighlight } = triggerMenuOptions()
  const triggers = fixtureTriggers()
  const id = createUniqueId()
  return (
    <TriggerMenu
      triggers={triggers}
      autoHighlight={autoHighlight}
      onOpenChange={(open, details) =>
        props.onOpen(`${open}:${details.reason}`)
      }
      onSelect={(value, details) =>
        props.onAction(selectAction(value, details.arguments))
      }
    >
      <label class="label" for={id}>
        {props.name}
      </label>
      <TriggerMenuInput
        id={id}
        name="message"
        class="input"
        render={
          input
            ? (props) => <input {...props} />
            : textarea
              ? (props) => <Textarea autoResize {...props} />
              : undefined
        }
      />
      <TriggerMenuHint class="hint" />
      <TriggerMenuStatus class="status" />
      <TriggerMenuContent class="popup list-popup">
        <Show when={empty}>
          <TriggerMenuEmpty class="empty">{f.empty}</TriggerMenuEmpty>
        </Show>
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
  )
}

function Fixture() {
  const { twice } = triggerMenuOptions()
  const [action, setAction] = createSignal("")
  const [open, setOpen] = createSignal("")
  const [submitted, setSubmitted] = createSignal("")
  return (
    <div class="fixture">
      <button>Before</button>
      <form
        class="composer"
        aria-label={f.formLabel}
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(String(new FormData(event.currentTarget).get("message")))
        }}
      >
        <Composer name={f.label} onAction={setAction} onOpen={setOpen} />
        <Show when={twice}>
          <Composer name="Second" onAction={setAction} onOpen={setOpen} />
        </Show>
        <button type="submit">{f.submit}</button>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <output role="status" aria-label="Open">
        {open()}
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
