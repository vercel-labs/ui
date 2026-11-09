import {
  MenuContent as MenuContentPrimitive,
  MenuGroupLabel as MenuGroupLabelPrimitive,
  MenuItem as MenuItemPrimitive,
  MenuItemIcon as MenuItemIconPrimitive,
  MenuRadioItem as MenuRadioItemPrimitive,
  MenuSeparator as MenuSeparatorPrimitive,
  MenuSubContent as MenuSubContentPrimitive,
  MenuSubTrigger as MenuSubTriggerPrimitive,
  MenuItemIndicator,
} from "@ui-sdk/solid/menu"
import { cn } from "cn"
import { Check, ChevronRight } from "@/components/icons"
import { omit, type ComponentProps } from "solid-js"
import type { JSX } from "@solidjs/web"

const item =
  "group relative flex min-h-7 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4"

const content =
  "max-h-(--available-height) min-w-44 origin-(--transform-origin) overflow-y-auto rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10"

function MenuContent<Payload = unknown>(
  props: Omit<ComponentProps<typeof MenuContentPrimitive<Payload>>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <MenuContentPrimitive<Payload>
      sideOffset={6}
      class={cn(content, props.class)}
      {...rest}
    />
  )
}

function MenuSubContent(
  props: Omit<ComponentProps<typeof MenuSubContentPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return <MenuSubContentPrimitive class={cn(content, props.class)} {...rest} />
}

function MenuSubTrigger(
  props: Omit<
    ComponentProps<typeof MenuSubTriggerPrimitive>,
    "class" | "children"
  > & {
    class?: string
    children?: JSX.Element
  }
) {
  const rest = omit(props, "class", "children")
  return (
    <MenuSubTriggerPrimitive
      class={cn(item, "data-open:bg-accent", props.class)}
      {...rest}
    >
      {props.children}
      <ChevronRight
        aria-hidden="true"
        class="ms-auto text-muted-foreground rtl:rotate-180"
      />
    </MenuSubTriggerPrimitive>
  )
}

function MenuItem(
  props: Omit<ComponentProps<typeof MenuItemPrimitive>, "class"> & {
    variant?: "default" | "destructive"
    class?: string
  }
) {
  const rest = omit(props, "variant", "class")
  return (
    <MenuItemPrimitive
      class={cn(
        item,
        (props.variant ?? "default") === "destructive" &&
          "text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive",
        props.class
      )}
      {...rest}
    />
  )
}

function MenuRadioItem(
  props: Omit<
    ComponentProps<typeof MenuRadioItemPrimitive>,
    "class" | "children"
  > & {
    class?: string
    children?: JSX.Element
  }
) {
  const rest = omit(props, "class", "children")
  return (
    <MenuRadioItemPrimitive class={cn(item, "pe-8", props.class)} {...rest}>
      {props.children}
      <MenuItemIndicator class="absolute end-2 flex size-4 items-center justify-center">
        <Check class="size-4" />
      </MenuItemIndicator>
    </MenuRadioItemPrimitive>
  )
}

function MenuItemIcon(
  props: Omit<ComponentProps<typeof MenuItemIconPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <MenuItemIconPrimitive
      class={cn(
        "flex text-muted-foreground group-data-highlighted:text-current",
        props.class
      )}
      {...rest}
    />
  )
}

function MenuGroupLabel(
  props: Omit<ComponentProps<typeof MenuGroupLabelPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <MenuGroupLabelPrimitive
      class={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        props.class
      )}
      {...rest}
    />
  )
}

function MenuSeparator(
  props: Omit<ComponentProps<typeof MenuSeparatorPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <MenuSeparatorPrimitive
      class={cn("-mx-1 my-1 h-px bg-border/50", props.class)}
      {...rest}
    />
  )
}

export {
  MenuContent,
  MenuGroupLabel,
  MenuItem,
  MenuItemIcon,
  MenuRadioItem,
  MenuSeparator,
  MenuSubContent,
  MenuSubTrigger,
}
export {
  createMenuController,
  Menu,
  MenuGroup,
  MenuRadioGroup,
  MenuShortcut,
  MenuSub,
  MenuTrigger,
} from "@ui-sdk/solid/menu"
