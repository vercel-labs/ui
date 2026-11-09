import {
  createListboxController,
  Listbox,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem,
  ListboxItemIcon,
  ListboxItemIndicator,
  ListboxSeparator,
} from "@ui-sdk/solid/listbox"
import { render } from "@solidjs/web"
import type { JSX } from "@solidjs/web"
import { createEffect, createSignal, For, Show } from "solid-js"
import { onItemsChange } from "tests/fixtures/items.ts"
import {
  changedToppings,
  listboxAction,
  listboxData,
  listboxFixture as f,
  listboxOptions,
  longToppings,
  type ListboxFixtureItem,
} from "tests/fixtures/listbox.ts"
import { serializeForm } from "tests/fixtures/select.ts"

const controller = createListboxController<string, boolean>()

function Item(props: ListboxFixtureItem) {
  return (
    <ListboxItem class="item" value={props.value} disabled={props.disabled}>
      <ListboxItemIcon class="icon" />
      {props.label}
      <ListboxItemIndicator class="indicator">✓</ListboxItemIndicator>
    </ListboxItem>
  )
}

// The items, or the groups with ?grouped.
function Items(props: {
  grouped: boolean
  long: boolean
  list: ListboxFixtureItem[]
}) {
  return (
    <Show
      when={!props.long}
      fallback={<For each={longToppings()}>{(item) => <Item {...item} />}</For>}
    >
      <Show
        when={props.grouped}
        fallback={<For each={props.list}>{(item) => <Item {...item} />}</For>}
      >
        <For each={f.groups}>
          {(group, index) => (
            <>
              <Show when={index() > 0}>
                <ListboxSeparator class="separator" />
              </Show>
              <ListboxGroup class="group">
                <ListboxGroupLabel class="label">
                  {group.label}
                </ListboxGroupLabel>
                <For each={group.items}>{(item) => <Item {...item} />}</For>
              </ListboxGroup>
            </>
          )}
        </For>
      </Show>
    </Show>
  )
}

function Fixture(props: { data?: boolean }) {
  const {
    fieldset,
    grouped,
    cancel,
    long,
    controlled,
    defaultValue,
    ...options
  } = listboxOptions()
  const [action, setAction] = createSignal("")
  const [reason, setReason] = createSignal("")
  const [submitted, setSubmitted] = createSignal("")
  const [list, setList] = createSignal<ListboxFixtureItem[]>(f.items)
  // Listens on the client only, in an effect: the server has no document.
  createEffect(
    () => 0,
    () => onItemsChange(changedToppings, setList)
  )
  const [value, setValue] = createSignal<string | string[] | null>(
    defaultValue ?? (options.multiple ? [] : null)
  )
  return (
    <div class="fixture">
      <button>Before</button>
      <form
        class="select-form"
        aria-label={f.formLabel}
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(serializeForm(event.currentTarget))
        }}
      >
        <Wrap fieldset={fieldset}>
          <Listbox<string, boolean>
            {...options}
            value={controlled ? value() : undefined}
            defaultValue={controlled ? undefined : defaultValue}
            class="listbox"
            aria-label={f.label}
            name={f.name}
            controller={controller}
            items={
              props.data
                ? long
                  ? longToppings()
                  : grouped
                    ? listboxData(true)
                    : list()
                : undefined
            }
            onValueChange={(next, details) => {
              setReason(details.reason)
              if (cancel) {
                return details.cancel()
              }
              setValue(next)
              setAction(listboxAction(next))
            }}
          >
            <Items grouped={grouped} long={long} list={list()} />
          </Listbox>
        </Wrap>
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <output role="status" aria-label="Reason">
        {reason()}
      </output>
      <output role="status" aria-label="Submitted">
        {submitted()}
      </output>
      <button onClick={() => controller.clear()}>{f.clear}</button>
      <button onClick={() => controller.selectAll()}>{f.selectAll}</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

// A disabled fieldset around the control, with ?fieldset.
function Wrap(props: { fieldset: boolean; children: JSX.Element }) {
  return (
    <Show when={props.fieldset} fallback={props.children}>
      <fieldset disabled>{props.children}</fieldset>
    </Show>
  )
}

export { Fixture, mount }
