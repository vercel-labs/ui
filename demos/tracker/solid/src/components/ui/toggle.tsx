import { Toggle as TogglePrimitive, ToggleGroup as ToggleGroupPrimitive } from "@ui-sdk/solid/toggle"
import { cn } from "cn"
import { omit, type ComponentProps } from "solid-js"

function ToggleGroup(props: Omit<ComponentProps<typeof ToggleGroupPrimitive>, "class"> & { class?: string }) {
  const rest = omit(props, "class")
  return (
    <ToggleGroupPrimitive
      class={cn("flex w-fit items-center gap-0.5 rounded-2xl bg-muted p-0.5", props.class)}
      {...rest}
    />
  )
}

function Toggle(props: Omit<ComponentProps<typeof TogglePrimitive>, "class"> & { class?: string }) {
  const rest = omit(props, "class")
  return (
    <TogglePrimitive
      class={cn(
        "inline-flex h-7 min-w-7 cursor-default items-center justify-center gap-1.5 rounded-[14px] px-1.5 text-sm font-medium text-muted-foreground outline-none select-none transition-[color,background-color,box-shadow] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-pressed:bg-background data-pressed:text-foreground data-pressed:shadow-xs motion-reduce:transition-none dark:data-pressed:bg-input/50 [&_svg]:size-4",
        props.class,
      )}
      {...rest}
    />
  )
}

export { Toggle, ToggleGroup }
