import {
  SelectContent as SelectContentPrimitive,
  SelectItem as SelectItemPrimitive,
  SelectItemIcon as SelectItemIconPrimitive,
  SelectItemIndicator,
  SelectLabel as SelectLabelPrimitive,
  SelectTrigger as SelectTriggerPrimitive,
  SelectValue,
  SelectValueIcon,
} from "@ui-sdk/solid/select"
import { cn } from "cn"
import { Check, ChevronDown } from "@/components/icons"
import { omit, type ComponentProps } from "solid-js"
import type { JSX } from "@solidjs/web"

function SelectLabel(
  props: Omit<ComponentProps<typeof SelectLabelPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <SelectLabelPrimitive
      class={cn("text-sm leading-none font-medium", props.class)}
      {...rest}
    />
  )
}

function SelectTrigger(
  props: Omit<
    ComponentProps<typeof SelectTriggerPrimitive>,
    "class" | "children"
  > & {
    icon?: boolean
    class?: string
  }
) {
  const rest = omit(props, "icon", "class")
  return (
    <SelectTriggerPrimitive
      class={cn(
        "flex h-8 w-full min-w-0 cursor-default items-center justify-between gap-1.5 rounded-2xl border border-transparent bg-input/50 px-3 text-sm whitespace-nowrap outline-none select-none transition-[color,box-shadow] duration-200 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-placeholder:text-muted-foreground data-disabled:opacity-50 motion-reduce:transition-none [&_svg]:size-4 [&_svg]:shrink-0",
        props.class
      )}
      {...rest}
    >
      {(props.icon ?? false) && (
        <SelectValueIcon class="flex text-muted-foreground" />
      )}
      <SelectValue class="min-w-0 flex-1 truncate text-start" />
      <ChevronDown aria-hidden="true" class="text-muted-foreground" />
    </SelectTriggerPrimitive>
  )
}

function SelectContent(
  props: Omit<ComponentProps<typeof SelectContentPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <SelectContentPrimitive
      class={cn(
        "max-h-(--available-height) min-w-(--anchor-width) origin-(--transform-origin) scroll-py-1 overflow-x-hidden overflow-y-auto rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10",
        props.class
      )}
      {...rest}
    />
  )
}

function SelectItem(
  props: Omit<
    ComponentProps<typeof SelectItemPrimitive>,
    "class" | "children"
  > & {
    class?: string
    children?: JSX.Element
  }
) {
  const rest = omit(props, "class", "children")
  return (
    <SelectItemPrimitive
      class={cn(
        "group relative flex min-h-7 w-full cursor-default items-center gap-2 rounded-xl py-1.5 ps-2 pe-8 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
        props.class
      )}
      {...rest}
    >
      {props.children}
      <SelectItemIndicator class="absolute end-2 flex size-4 items-center justify-center">
        <Check aria-hidden="true" />
      </SelectItemIndicator>
    </SelectItemPrimitive>
  )
}

function SelectItemIcon(
  props: Omit<ComponentProps<typeof SelectItemIconPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <SelectItemIconPrimitive
      class={cn(
        "flex text-muted-foreground group-data-highlighted:text-current",
        props.class
      )}
      {...rest}
    />
  )
}

export { SelectContent, SelectItem, SelectItemIcon, SelectLabel, SelectTrigger }
export { Select } from "@ui-sdk/solid/select"
