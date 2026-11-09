import {
  createListboxController,
  Listbox,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem,
  ListboxItemIcon,
  ListboxItemIndicator,
  ListboxSeparator,
  type ListData,
} from "@ui-sdk/react/listbox"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import * as React from "react"
import { createRoot } from "react-dom/client"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import {
  describe,
  groups,
  toppings,
  variantData,
  type Variant,
} from "./variants"

function Leaf() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 19c8 0 14-6 14-14C11 5 5 11 5 19Zm0 0 7-7" />
    </svg>
  )
}

function Item({
  value,
  label,
  disabled,
  link,
}: {
  value: unknown
  label: string
  disabled?: boolean
  link?: boolean
}) {
  return (
    <ListboxItem
      className={classes.item}
      value={value}
      disabled={disabled}
      render={link ? <a href={`#${value}`} /> : undefined}
    >
      <ListboxItemIcon className={classes.icon}>
        <Leaf />
      </ListboxItemIcon>
      {label}
      <ListboxItemIndicator className={classes.indicator}>
        ✓
      </ListboxItemIndicator>
    </ListboxItem>
  )
}

function Items({ variant }: { variant: Variant }) {
  if (variant.items !== "grouped") {
    return toppings.map((item) => (
      <Item key={item.value} {...item} link={variant.links} />
    ))
  }
  return groups.map((group, index) => (
    <React.Fragment key={group.label}>
      {index > 0 && <ListboxSeparator className={classes.separator} />}
      <ListboxGroup className={classes.group}>
        <ListboxGroupLabel className={classes.groupLabel}>
          {group.label}
        </ListboxGroupLabel>
        {group.items.map((item) => (
          <Item key={item.value} {...item} />
        ))}
      </ListboxGroup>
    </React.Fragment>
  ))
}

// A data listbox's items, from its state. Keyed by label, since values may be objects.
function DataItems({ list }: { list: ListData<any> }) {
  return list.map((entry, index) => {
    if (typeof entry === "string") {
      return <Item key={entry} value={entry} label={entry} />
    }
    if ("type" in entry && entry.type === "separator") {
      return (
        <ListboxSeparator
          key={`separator-${index}`}
          className={classes.separator}
        />
      )
    }
    if ("type" in entry && entry.type === "group") {
      return (
        <ListboxGroup key={entry.label} className={classes.group}>
          <ListboxGroupLabel className={classes.groupLabel}>
            {entry.label}
          </ListboxGroupLabel>
          <DataItems list={entry.items} />
        </ListboxGroup>
      )
    }
    return <Item key={entry.label} {...entry} />
  })
}

function VariantListbox({ variant, env }: { variant: Variant; env: Env }) {
  const { fieldDisabled, ...options } = (variant.options ?? {}) as Record<
    string,
    any
  >
  const [value, setValue] = React.useState<unknown>(
    options.multiple ? [] : null
  )
  const [controller] = React.useState(() =>
    variant.controller ? createListboxController<string, true>() : undefined
  )
  React.useEffect(() => {
    if (!controller) {
      return
    }
    env.controls([
      ["selectAll()", () => controller.selectAll()],
      ["clear()", () => controller.clear()],
      ['setValue(["onion"])', () => controller.setValue(["onion"])],
      ["getValue()", () => controller.getValue()],
      ["focus()", () => controller.focus()],
    ])
  }, [controller, env])
  const listbox = (
    <Listbox<any, boolean>
      className={classes.root}
      {...options}
      {...(variant.controlled && { value })}
      aria-label={variant.field ? undefined : "Toppings"}
      controller={controller}
      items={variant.data ? variantData(variant) : undefined}
      onValueChange={(next, details) => {
        if (variant.cancel) {
          return details.cancel()
        }
        if (variant.controlled) {
          setValue(next)
        }
        env.log(
          `valueChange ${describe(next)} (${details.reason}, ${details.source})`
        )
      }}
    >
      {variant.data ? (
        (state) => <DataItems list={state.items as ListData<any>} />
      ) : (
        <Items variant={variant} />
      )}
    </Listbox>
  )
  if (variant.field) {
    return (
      <Field disabled={!!fieldDisabled} className="flex flex-col gap-1.5">
        <FieldLabel className={classes.label}>Toppings</FieldLabel>
        {listbox}
        <FieldDescription className={classes.description}>
          Pick what goes on top.
        </FieldDescription>
      </Field>
    )
  }
  if (!variant.form) {
    return listbox
  }
  return (
    <form
      className="flex flex-col items-start gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        env.log(
          `submit ${new URLSearchParams(new FormData(event.currentTarget) as never).toString()}`
        )
      }}
      onReset={() => env.log("reset")}
    >
      {listbox}
      <div className="flex gap-2">
        <button className={classes.button}>Submit</button>
        <button type="reset" className={classes.control}>
          Reset
        </button>
      </div>
    </form>
  )
}

function mount(root: HTMLElement) {
  kitchenSink(root, "react", (slot, variant, env) =>
    createRoot(slot).render(
      <React.StrictMode>
        <VariantListbox variant={variant} env={env} />
      </React.StrictMode>
    )
  )
}

export { mount }
