import { ResizableHandle as ResizableHandlePrimitive } from "@ui-sdk/solid/resizable"
import { cn } from "cn"
import { omit, type ComponentProps } from "solid-js"

function ResizableHandle(
  props: Omit<ComponentProps<typeof ResizableHandlePrimitive>, "class" | "children"> & { class?: string },
) {
  const rest = omit(props, "class")
  return (
    <ResizableHandlePrimitive
      class={cn(
        "relative flex w-px items-center justify-center bg-border outline-none after:absolute after:inset-y-0 after:-inset-x-1 focus-visible:ring-3 focus-visible:ring-ring/30 data-dragging:bg-ring data-hovered:bg-ring",
        props.class,
      )}
      {...rest}
    >
      <div class="z-10 h-6 w-1 shrink-0 rounded-lg bg-border" />
    </ResizableHandlePrimitive>
  )
}

export { ResizableHandle }
export { Resizable, ResizablePanel } from "@ui-sdk/solid/resizable"
