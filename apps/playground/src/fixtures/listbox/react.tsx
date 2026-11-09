import {
  createListboxController,
  Listbox,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem,
  ListboxItemIcon,
  ListboxItemIndicator,
  ListboxSeparator,
} from "@ui-sdk/react/listbox"
import * as React from "react"
import { createRoot } from "react-dom/client"
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

function Item({ value, label, disabled }: ListboxFixtureItem) {
  return (
    <ListboxItem className="item" value={value} disabled={disabled}>
      <ListboxItemIcon className="icon" />
      {label}
      <ListboxItemIndicator className="indicator">✓</ListboxItemIndicator>
    </ListboxItem>
  )
}

// The items, or the groups with ?grouped.
function Items({
  grouped,
  long,
  list,
}: {
  grouped: boolean
  long: boolean
  list: ListboxFixtureItem[]
}) {
  if (long) {
    return longToppings().map((item) => <Item key={item.value} {...item} />)
  }
  if (!grouped) {
    return list.map((item) => <Item key={item.value} {...item} />)
  }
  return f.groups.map((group, index) => (
    <React.Fragment key={group.label}>
      {index > 0 && <ListboxSeparator className="separator" />}
      <ListboxGroup className="group">
        <ListboxGroupLabel className="label">{group.label}</ListboxGroupLabel>
        {group.items.map((item) => (
          <Item key={item.value} {...item} />
        ))}
      </ListboxGroup>
    </React.Fragment>
  ))
}

function Fixture({ data = false }: { data?: boolean }) {
  const {
    fieldset,
    grouped,
    cancel,
    long,
    controlled,
    defaultValue,
    ...options
  } = listboxOptions()
  const [action, setAction] = React.useState("")
  const [reason, setReason] = React.useState("")
  const [submitted, setSubmitted] = React.useState("")
  const [list, setList] = React.useState<ListboxFixtureItem[]>(f.items)
  React.useEffect(() => onItemsChange(changedToppings, setList), [])
  const [value, setValue] = React.useState<string | string[] | null>(
    defaultValue ?? (options.multiple ? [] : null)
  )
  return (
    <div className="fixture">
      <button>Before</button>
      <form
        className="select-form"
        aria-label={f.formLabel}
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(serializeForm(event.currentTarget))
        }}
      >
        <Wrap fieldset={fieldset}>
          <Listbox<string, boolean>
            {...options}
            {...(controlled ? { value } : { defaultValue })}
            className="listbox"
            aria-label={f.label}
            name={f.name}
            controller={controller}
            items={
              data
                ? long
                  ? longToppings()
                  : grouped
                    ? listboxData(true)
                    : list
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
            <Items grouped={grouped} long={long} list={list} />
          </Listbox>
        </Wrap>
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <output role="status" aria-label="Reason">
        {reason}
      </output>
      <output role="status" aria-label="Submitted">
        {submitted}
      </output>
      <button onClick={() => controller.clear()}>{f.clear}</button>
      <button onClick={() => controller.selectAll()}>{f.selectAll}</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

// A disabled fieldset around the control, with ?fieldset.
function Wrap({
  fieldset,
  children,
}: {
  fieldset: boolean
  children: React.ReactNode
}) {
  return fieldset ? <fieldset disabled>{children}</fieldset> : <>{children}</>
}

export { Fixture, mount }
