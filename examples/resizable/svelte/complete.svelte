<script lang="ts">
  import {
    Resizable,
    ResizableHandle,
    ResizablePanel,
    type ResizableLayoutCommitDetails,
  } from "@ui-sdk/svelte/resizable"

  let moves = $state(0)
  let saved = $state("nothing yet")

  function save(layout: number[], details: ResizableLayoutCommitDetails) {
    saved = `${layout.map(Math.round).join(" / ")} after ${details.reason}`
  }
</script>

<div class="flex w-full max-w-md flex-col gap-3">
  <Resizable
    onLayoutChange={() => moves++}
    onLayoutCommit={save}
    class="h-50 w-full rounded-2xl border border-border"
  >
    <ResizablePanel
      defaultSize={40}
      class="flex items-center justify-center p-6 text-sm font-medium"
    >Files</ResizablePanel>
    <ResizableHandle
      aria-label="Resize files"
      class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full"
    />
    <ResizablePanel class="flex items-center justify-center p-6 text-sm font-medium">Editor</ResizablePanel>
  </Resizable>
  <output class="text-sm text-muted-foreground tabular-nums">{moves} changes, saved {saved}</output>
</div>
