<script lang="ts">
  import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/svelte/resizable"
</script>

<Resizable
  step={5}
  largeStep={25}
  class="h-50 w-full max-w-md rounded-2xl border border-border"
>
  <ResizablePanel
    defaultSize={50}
    minSize={10}
    class="flex items-center justify-center p-6 text-sm font-medium"
  >
    Left
  </ResizablePanel>
  <ResizableHandle
    aria-label="Resize left"
    class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full"
  />
  <ResizablePanel
    defaultSize={50}
    minSize={10}
    class="flex items-center justify-center p-6 text-sm font-medium"
  >
    Right
  </ResizablePanel>
</Resizable>
