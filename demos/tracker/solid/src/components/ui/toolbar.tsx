import {
  ToolbarSeparator as ToolbarSeparatorPrimitive,
  Toolbar as ToolbarPrimitive,
} from "@ui-sdk/solid/toolbar"
import { cn } from "cn"
import { omit, type ComponentProps } from "solid-js"

function Toolbar(props: Omit<ComponentProps<typeof ToolbarPrimitive>, "class"> & { class?: string }) {
  const rest = omit(props, "class")
  return <ToolbarPrimitive class={cn("flex items-center gap-2", props.class)} {...rest} />
}

function ToolbarSeparator(
  props: Omit<ComponentProps<typeof ToolbarSeparatorPrimitive>, "class"> & { class?: string },
) {
  const rest = omit(props, "class")
  return <ToolbarSeparatorPrimitive class={cn("mx-1 h-5 w-px shrink-0 bg-border", props.class)} {...rest} />
}

export { Toolbar, ToolbarSeparator }
export { ToolbarButton } from "@ui-sdk/solid/toolbar"
