import {
  SliderControl,
  SliderIndicator,
  Slider as SliderPrimitive,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/solid/slider"
import { cn } from "cn"
import { omit, type ComponentProps } from "solid-js"
import type { JSX } from "@solidjs/web"

function Slider(
  props: Omit<ComponentProps<typeof SliderPrimitive>, "class" | "children"> & {
    label: JSX.Element
    class?: string
  }
) {
  const rest = omit(props, "label", "class")
  return (
    <SliderPrimitive class={cn("flex flex-col gap-2", props.class)} {...rest}>
      <div class="flex items-center justify-between text-sm">
        {props.label}
        <SliderValue class="text-muted-foreground tabular-nums" />
      </div>
      <SliderControl class="flex w-full items-center py-2 select-none data-disabled:opacity-50">
        <SliderTrack class="h-1 w-full rounded-2xl bg-input/90">
          <SliderIndicator class="rounded-2xl bg-primary" />
          <SliderThumb class="block size-4 shrink-0 cursor-default rounded-2xl bg-white shadow-md ring-1 ring-black/10 transition-shadow duration-200 hover:ring-4 hover:ring-ring/30 has-focus-visible:ring-4 has-focus-visible:ring-ring/30 data-dragging:ring-4 data-dragging:ring-ring/30 motion-reduce:transition-none" />
        </SliderTrack>
      </SliderControl>
    </SliderPrimitive>
  )
}

export { Slider }
