<script lang="ts">
  import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/svelte"

  // How often the first panel's snippet rendered, for specs that check a drag
  // renders nothing that doesn't read the size. A snippet renders again when
  // a state key it read changes, so the count reads the key the span shows.
  const counts = { renders: 0 }
  Object.assign(window, { panelRenders: counts })
  let action = $state("")

  function count(...reads: unknown[]) {
    counts.renders++
    return true
  }
</script>

<div class="fixture">
  <button>Before</button>
  <Resizable
    class="resizable"
    onLayoutCommit={(layout) => (action = `layout:${layout.map(Math.round)}`)}
  >
    <ResizablePanel
      defaultSize={30}
      collapsible
      minSize={10}
      class="resizable-panel"
      role="group"
      aria-label="Files"
    >
      {#snippet children(state)}
        {#if count(state.collapsed)}
          <span class="panel-state"
            >{state.collapsed ? "Collapsed" : "Open"}</span
          >
        {/if}
      {/snippet}
    </ResizablePanel>
    <ResizableHandle aria-label="Resize files" class="resizable-handle">
      {#snippet render({ props, state })}
        <span {...props}>
          <span class="handle-state"
            >{state.dragging ? "dragging" : "idle"}</span
          >
        </span>
      {/snippet}
    </ResizableHandle>
    <ResizablePanel class="resizable-panel" role="group" aria-label="Editor">
      {#snippet children(state)}
        <span class="panel-size">{Math.round(state.size)}</span>
      {/snippet}
    </ResizablePanel>
  </Resizable>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
