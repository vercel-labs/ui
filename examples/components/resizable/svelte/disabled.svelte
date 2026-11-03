<script lang="ts">
  import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/svelte/resizable"

  let disabled = $state(false)
</script>

<div data-slot="stack">
  <Resizable {disabled}>
    <ResizablePanel>Fixed</ResizablePanel>
    <ResizableHandle disabled aria-label="Resize fixed" />
    <ResizablePanel>Two</ResizablePanel>
    <ResizableHandle aria-label="Resize two" />
    <ResizablePanel>Three</ResizablePanel>
  </Resizable>
  <label data-slot="label">
    <input bind:checked={disabled} type="checkbox" />
    Disable the group
  </label>
</div>
