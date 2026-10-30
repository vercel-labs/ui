import { TooltipContent as TooltipContentPrimitive } from "@ui-sdk/solid/tooltip"
import { cn } from "cn"
import { omit, type ComponentProps } from "solid-js"

function TooltipContent(
  props: Omit<ComponentProps<typeof TooltipContentPrimitive>, "class"> & { class?: string },
) {
  const rest = omit(props, "class")
  return (
    <TooltipContentPrimitive
      sideOffset={6}
      class={cn(
        "inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-xl bg-foreground px-3 py-1.5 text-xs text-background transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 data-instant:transition-none motion-reduce:transition-none",
        props.class,
      )}
      {...rest}
    />
  )
}

export { TooltipContent }
export { Tooltip, TooltipShortcut, TooltipTrigger } from "@ui-sdk/solid/tooltip"
