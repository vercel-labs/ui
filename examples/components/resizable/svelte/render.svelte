<script lang="ts">
  import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/svelte/resizable"
</script>

<Resizable>
  <ResizablePanel defaultSize={35} minSize={20} collapsible>
    {#snippet children(state)}
      <span>Files</span>
      <span data-slot="hint">
        {state.collapsed ? "Collapsed" : `${Math.round(state.size)}%`}
      </span>
    {/snippet}
  </ResizablePanel>
  <ResizableHandle aria-label="Resize files">
    {#snippet render({ props })}
      <div
        {...props}
      ></div>
    {/snippet}
  </ResizableHandle>
  <ResizablePanel>
    {#snippet children(state)}Editor, {state.orientation}{/snippet}
  </ResizablePanel>
</Resizable>
