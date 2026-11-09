import {
  ComboboxChip as ComboboxChipPrimitive,
  ComboboxChipRemove,
  ComboboxChips as ComboboxChipsPrimitive,
  ComboboxContent as ComboboxContentPrimitive,
  ComboboxEmpty as ComboboxEmptyPrimitive,
  ComboboxInput as ComboboxInputPrimitive,
  ComboboxItem as ComboboxItemPrimitive,
  ComboboxItemIndicator,
  ComboboxLabel as ComboboxLabelPrimitive,
  ComboboxTrigger as ComboboxTriggerPrimitive,
} from "@ui-sdk/solid/combobox"
import { cn } from "cn"
import { Check, ChevronDown, X } from "@/components/icons"
import { omit, type ComponentProps } from "solid-js"
import type { JSX } from "@solidjs/web"

function ComboboxLabel(
  props: Omit<ComponentProps<typeof ComboboxLabelPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <ComboboxLabelPrimitive
      class={cn("text-sm leading-none font-medium", props.class)}
      {...rest}
    />
  )
}

function ComboboxChips(
  props: Omit<ComponentProps<typeof ComboboxChipsPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <ComboboxChipsPrimitive
      class={cn(
        "relative flex min-h-8 w-full flex-wrap items-center gap-1 rounded-2xl border border-transparent bg-input/50 bg-clip-padding py-1 ps-1 pe-8 text-sm transition-[color,box-shadow] duration-200 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30 motion-reduce:transition-none",
        props.class
      )}
      {...rest}
    />
  )
}

function ComboboxChip(props: {
  value: string
  label: string
  class?: string
  children?: JSX.Element
}) {
  return (
    <ComboboxChipPrimitive
      value={props.value}
      class={cn(
        "flex h-5.5 w-fit items-center gap-1 rounded-2xl bg-input ps-1.5 pe-0.5 text-xs font-medium whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
        props.class
      )}
    >
      {props.children}
      {props.label}
      <ComboboxChipRemove
        aria-label={`Remove ${props.label}`}
        class="-ms-0.5 flex size-4.5 cursor-default items-center justify-center rounded-full opacity-50 outline-none hover:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        <X aria-hidden="true" class="size-3" />
      </ComboboxChipRemove>
    </ComboboxChipPrimitive>
  )
}

function ComboboxInput(
  props: Omit<ComponentProps<typeof ComboboxInputPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <ComboboxInputPrimitive
      class={cn(
        "h-6 min-w-8 flex-1 bg-transparent px-1.5 text-base outline-none placeholder:text-muted-foreground md:text-sm",
        props.class
      )}
      {...rest}
    />
  )
}

function ComboboxTrigger(
  props: Omit<
    ComponentProps<typeof ComboboxTriggerPrimitive>,
    "class" | "children"
  > & { class?: string }
) {
  const rest = omit(props, "class")
  return (
    <ComboboxTriggerPrimitive
      class={cn(
        "group absolute end-1 top-1 inline-flex size-6 cursor-default items-center justify-center rounded-xl text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-open:bg-muted motion-reduce:transition-none",
        props.class
      )}
      {...rest}
    >
      <ChevronDown
        aria-hidden="true"
        class="size-4 transition-transform group-data-open:rotate-180"
      />
    </ComboboxTriggerPrimitive>
  )
}

function ComboboxContent(
  props: Omit<ComponentProps<typeof ComboboxContentPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <ComboboxContentPrimitive
      class={cn(
        "max-h-[min(18rem,var(--available-height))] w-(--anchor-width) min-w-44 origin-(--transform-origin) scroll-py-1 overflow-x-hidden overflow-y-auto rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10",
        props.class
      )}
      {...rest}
    />
  )
}

function ComboboxEmpty(
  props: Omit<ComponentProps<typeof ComboboxEmptyPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <ComboboxEmptyPrimitive
      class={cn(
        "py-2 text-center text-sm text-muted-foreground empty:hidden",
        props.class
      )}
      {...rest}
    />
  )
}

function ComboboxItem(
  props: Omit<
    ComponentProps<typeof ComboboxItemPrimitive>,
    "class" | "children"
  > & {
    class?: string
    children?: JSX.Element
  }
) {
  const rest = omit(props, "class", "children")
  return (
    <ComboboxItemPrimitive
      class={cn(
        "relative flex min-h-7 w-full cursor-default items-center gap-2 rounded-xl py-1.5 ps-2 pe-8 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        props.class
      )}
      {...rest}
    >
      {props.children}
      <ComboboxItemIndicator class="absolute end-2 flex size-4 items-center justify-center">
        <Check aria-hidden="true" class="size-4" />
      </ComboboxItemIndicator>
    </ComboboxItemPrimitive>
  )
}

export {
  ComboboxChip,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxTrigger,
}
export { Combobox, ComboboxList, ComboboxValue } from "@ui-sdk/solid/combobox"
