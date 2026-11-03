<script lang="ts">
  import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/svelte/resizable"
</script>

<Resizable class="h-50 w-full max-w-md rounded-2xl border border-border">
  <ResizablePanel
    defaultSize="200px"
    minSize="160px"
    maxSize="320px"
    class="flex items-center justify-center p-6 text-sm font-medium"
  >
    Navigation
  </ResizablePanel>
  <ResizableHandle
    aria-label="Resize navigation"
    class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full [&[aria-orientation=horizontal]>div]:rotate-90"
  >
    <div class="z-10 h-6 w-1 shrink-0 rounded-lg bg-border"></div>
  </ResizableHandle>
  <ResizablePanel
    minSize={30}
    class="flex items-center justify-center p-6 text-sm font-medium"
  >Content</ResizablePanel>
</Resizable>
