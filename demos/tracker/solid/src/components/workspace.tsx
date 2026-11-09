import type { JSX } from "@solidjs/web"
import { Show } from "solid-js"
import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@/components/ui/resizable"

function Workspace(props: {
  open: boolean
  detail: JSX.Element
  children: JSX.Element
}) {
  return (
    <Resizable autoSaveId="tracker" class="min-h-0 flex-1">
      <ResizablePanel
        id="list"
        defaultSize={props.open ? 58 : 100}
        minSize={30}
        class={
          props.open
            ? "flex min-w-0 flex-col max-md:hidden"
            : "flex min-w-0 flex-col"
        }
      >
        {props.children}
      </ResizablePanel>
      <Show when={props.open}>
        <ResizableHandle
          aria-label="Resize issue details"
          class="max-md:hidden"
        />
        <ResizablePanel
          id="detail"
          defaultSize={42}
          minSize={28}
          class="flex min-w-0 flex-col max-md:flex-1!"
        >
          {props.detail}
        </ResizablePanel>
      </Show>
    </Resizable>
  )
}

export { Workspace }
