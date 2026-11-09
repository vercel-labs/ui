import {
  DrawerBackdrop as DrawerBackdropPrimitive,
  DrawerContent as DrawerContentPrimitive,
  DrawerTitle as DrawerTitlePrimitive,
} from "@ui-sdk/solid/drawer"
import { cn } from "cn"
import { omit, type ComponentProps } from "solid-js"
import type { JSX } from "@solidjs/web"

function DrawerContent(
  props: Omit<
    ComponentProps<typeof DrawerContentPrimitive>,
    "class" | "children"
  > & {
    class?: string
    children?: JSX.Element
  }
) {
  const rest = omit(props, "class", "children")
  return (
    <>
      <DrawerBackdropPrimitive class="fixed inset-0 bg-black/30 supports-backdrop-filter:backdrop-blur-sm" />
      <DrawerContentPrimitive
        class={cn(
          "relative mx-auto flex max-h-[85dvh] w-full max-w-lg flex-col rounded-t-[min(var(--radius-4xl),24px)] bg-popover text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none after:absolute after:inset-x-0 after:top-full after:h-24 after:bg-inherit dark:ring-foreground/10",
          props.class
        )}
        {...rest}
      >
        <div
          aria-hidden="true"
          class="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-muted"
        />
        {props.children}
      </DrawerContentPrimitive>
    </>
  )
}

function DrawerTitle(
  props: Omit<ComponentProps<typeof DrawerTitlePrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <DrawerTitlePrimitive
      class={cn("text-base font-medium", props.class)}
      {...rest}
    />
  )
}

export { DrawerContent, DrawerTitle }
export { Drawer, DrawerClose, DrawerTrigger } from "@ui-sdk/solid/drawer"
