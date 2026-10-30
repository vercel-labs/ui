import {
  TriggerMenuContent as TriggerMenuContentPrimitive,
  TriggerMenuItem as TriggerMenuItemPrimitive,
} from "@ui-sdk/solid/trigger-menu"
import { cn } from "cn"
import { omit, type ComponentProps } from "solid-js"

function TriggerMenuContent(
  props: Omit<ComponentProps<typeof TriggerMenuContentPrimitive>, "class"> & { class?: string },
) {
  const rest = omit(props, "class")
  return (
    <TriggerMenuContentPrimitive
      class={cn(
        "max-h-[min(18rem,var(--available-height))] w-56 origin-(--transform-origin) scroll-py-1 overflow-y-auto rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10",
        props.class,
      )}
      {...rest}
    />
  )
}

function TriggerMenuItem(
  props: Omit<ComponentProps<typeof TriggerMenuItemPrimitive>, "class"> & { class?: string },
) {
  const rest = omit(props, "class")
  return (
    <TriggerMenuItemPrimitive
      class={cn(
        "flex min-h-7 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        props.class,
      )}
      {...rest}
    />
  )
}

export { TriggerMenuContent, TriggerMenuItem }
export { TriggerMenu, TriggerMenuList } from "@ui-sdk/solid/trigger-menu"
