import { HoverCardContent as HoverCardContentPrimitive } from "@ui-sdk/solid/hover-card"
import { cn } from "cn"
import { omit, type ComponentProps } from "solid-js"
import { popup } from "./popover"

function HoverCardContent(
  props: Omit<ComponentProps<typeof HoverCardContentPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <HoverCardContentPrimitive
      sideOffset={8}
      class={cn("flex w-64 flex-col gap-3", popup, props.class)}
      {...rest}
    />
  )
}

export { HoverCardContent }
export { HoverCard, HoverCardTrigger } from "@ui-sdk/solid/hover-card"
