import {
  CommandEmpty as CommandEmptyPrimitive,
  CommandGroupLabel as CommandGroupLabelPrimitive,
  CommandInput as CommandInputPrimitive,
  CommandItem as CommandItemPrimitive,
  CommandItemIcon as CommandItemIconPrimitive,
  CommandList as CommandListPrimitive,
} from "@ui-sdk/solid/command"
import { cn } from "cn"
import { Search } from "@/components/icons"
import { omit, type ComponentProps } from "solid-js"

function CommandInput(
  props: Omit<ComponentProps<typeof CommandInputPrimitive>, "class"> & { class?: string },
) {
  const rest = omit(props, "class")
  return (
    <div class="flex items-center gap-2 border-b border-border px-4">
      <Search aria-hidden="true" class="size-4 shrink-0 text-muted-foreground" />
      <CommandInputPrimitive
        class={cn(
          "h-12 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground md:text-sm",
          props.class,
        )}
        {...rest}
      />
    </div>
  )
}

function CommandList(props: Omit<ComponentProps<typeof CommandListPrimitive>, "class"> & { class?: string }) {
  const rest = omit(props, "class")
  return (
    <CommandListPrimitive
      class={cn("max-h-80 min-h-0 scroll-py-1 overflow-y-auto overscroll-contain p-1", props.class)}
      {...rest}
    />
  )
}

function CommandGroupLabel(
  props: Omit<ComponentProps<typeof CommandGroupLabelPrimitive>, "class"> & { class?: string },
) {
  const rest = omit(props, "class")
  return (
    <CommandGroupLabelPrimitive
      class={cn("px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground", props.class)}
      {...rest}
    />
  )
}

function CommandItem(props: Omit<ComponentProps<typeof CommandItemPrimitive>, "class"> & { class?: string }) {
  const rest = omit(props, "class")
  return (
    <CommandItemPrimitive
      class={cn(
        "group flex min-h-8 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        props.class,
      )}
      {...rest}
    />
  )
}

function CommandItemIcon(
  props: Omit<ComponentProps<typeof CommandItemIconPrimitive>, "class"> & { class?: string },
) {
  const rest = omit(props, "class")
  return (
    <CommandItemIconPrimitive
      class={cn("flex text-muted-foreground group-data-highlighted:text-current [&_svg]:size-4", props.class)}
      {...rest}
    />
  )
}

function CommandEmpty(
  props: Omit<ComponentProps<typeof CommandEmptyPrimitive>, "class"> & { class?: string },
) {
  const rest = omit(props, "class")
  return (
    <CommandEmptyPrimitive
      class={cn("py-10 text-center text-sm text-muted-foreground empty:hidden", props.class)}
      {...rest}
    />
  )
}

export { CommandEmpty, CommandGroupLabel, CommandInput, CommandItem, CommandItemIcon, CommandList }
export { Command, CommandGroup } from "@ui-sdk/solid/command"
