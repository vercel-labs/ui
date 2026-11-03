<script lang="ts">
  import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/svelte/resizable"

  let layout = $state([30, 70])
</script>

<div data-slot="stack">
  <Resizable bind:layout>
    <ResizablePanel
      minSize={20}
    >Files</ResizablePanel>
    <ResizableHandle aria-label="Resize files" />
    <ResizablePanel
      minSize={20}
    >Editor</ResizablePanel>
  </Resizable>
  <div data-slot="row">
    <button data-variant="secondary" type="button" onclick={() => (layout = [20, 80])}>
      Narrow
    </button>
    <button data-variant="secondary" type="button" onclick={() => (layout = [50, 50])}>
      Even
    </button>
  </div>
  <output data-slot="output">{layout.map(Math.round).join(" / ")}</output>
</div>
