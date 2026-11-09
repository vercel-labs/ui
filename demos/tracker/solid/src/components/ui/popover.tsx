import { PopoverContent as PopoverContentPrimitive } from "@ui-sdk/solid/popover"
import { cn } from "cn"
import { omit, type ComponentProps } from "solid-js"

const popup =
  "origin-(--transform-origin) rounded-3xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10"

function PopoverContent(
  props: Omit<ComponentProps<typeof PopoverContentPrimitive>, "class"> & {
    class?: string
  }
) {
  const rest = omit(props, "class")
  return (
    <PopoverContentPrimitive
      sideOffset={8}
      class={cn("flex w-72 flex-col gap-3", popup, props.class)}
      {...rest}
    />
  )
}

export { PopoverContent, popup }
export {
  Popover,
  PopoverClose,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/solid/popover"
