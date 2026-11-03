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

<div data-slot="stack">
  <Resizable onLayoutChange={() => moves++} onLayoutCommit={save}>
    <ResizablePanel
      defaultSize={40}
    >Files</ResizablePanel>
    <ResizableHandle aria-label="Resize files" />
    <ResizablePanel>Editor</ResizablePanel>
  </Resizable>
  <output data-slot="output">{moves} changes, saved {saved}</output>
</div>
