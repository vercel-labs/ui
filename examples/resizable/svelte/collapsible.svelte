<script lang="ts">
  import { Folder, Search } from "@lucide/svelte"
  import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/svelte/resizable"
</script>

<Resizable class="h-50 w-full max-w-md rounded-2xl border border-border">
  <ResizablePanel
    defaultSize={30}
    minSize={25}
    collapsible
    collapsedSize="56px"
    class="group flex flex-col gap-1 p-2 text-sm"
  >
    <span
      class="flex h-8 items-center gap-2 rounded-xl bg-muted px-2.5 font-medium group-data-collapsed:justify-center group-data-collapsed:px-0"
    >
      <Folder class="size-4 shrink-0" />
      <span class="truncate group-data-collapsed:hidden">Files</span>
    </span>
    <span
      class="flex h-8 items-center gap-2 rounded-xl px-2.5 text-muted-foreground group-data-collapsed:justify-center group-data-collapsed:px-0"
    >
      <Search class="size-4 shrink-0" />
      <span class="truncate group-data-collapsed:hidden">Search</span>
    </span>
  </ResizablePanel>
  <ResizableHandle
    aria-label="Resize sidebar"
    class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full [&[aria-orientation=horizontal]>div]:rotate-90"
  >
    <div class="z-10 h-6 w-1 shrink-0 rounded-lg bg-border"></div>
  </ResizableHandle>
  <ResizablePanel class="flex items-center justify-center p-6 text-sm font-medium">Editor</ResizablePanel>
</Resizable>
