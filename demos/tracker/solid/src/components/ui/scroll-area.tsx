import {
  ScrollAreaContent,
  ScrollArea as ScrollAreaPrimitive,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/solid/scroll-area"
import { cn } from "cn"
import type { JSX } from "@solidjs/web"

function ScrollArea(props: { label?: string; class?: string; children: JSX.Element }) {
  return (
    <ScrollAreaPrimitive class={cn("relative min-h-0", props.class)}>
      <ScrollAreaViewport
        aria-label={props.label}
        class="size-full rounded-[inherit] outline-none focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:ring-inset"
      >
        <ScrollAreaContent>{props.children}</ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar class="flex w-2.5 p-px opacity-0 transition-opacity duration-150 data-visible:opacity-100 motion-reduce:transition-none">
        <ScrollAreaThumb class="relative flex-1 rounded-full bg-border" />
      </ScrollAreaScrollbar>
    </ScrollAreaPrimitive>
  )
}

export { ScrollArea }
