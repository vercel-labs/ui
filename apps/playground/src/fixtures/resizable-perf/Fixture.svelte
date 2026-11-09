<script lang="ts">
  import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/svelte"
  import { countRender, perfItems, perfSize } from "tests/fixtures/perf.ts"

  // A group of N panels for the counts specs. The first two take
  // a quarter each and the rest share the other half, so the first handle has
  // room to move. Every other panel reads its size in its render snippet, so
  // specs can tell plain panels' renders from watched ones. The second panel,
  // which the first handle resizes, is a watched one. An update is the part's
  // props changing, which each count reads so it counts them, or a state key it read.
  const panels = perfItems(perfSize())
  const count = (kind: "watched" | "plain" | "handle", ...reads: unknown[]) => (
    countRender(kind),
    ""
  )
</script>

<div class="fixture">
  <button>Before</button>
  <Resizable class="resizable-perf">
    {#each panels as panel, index (panel.value)}
      {#if index > 0}
        <ResizableHandle
          class="resizable-perf-handle"
          aria-label={`Handle ${index}`}
        >
          {#snippet render({ props })}
            <div {...props}>{count("handle", props)}</div>
          {/snippet}
        </ResizableHandle>
      {/if}
      {#if index % 2}
        <ResizablePanel
          id={panel.value}
          defaultSize={index < 2 ? 25 : undefined}
          class="resizable-panel"
        >
          {#snippet render({ props, state })}
            <div {...props} data-size={Math.round(state.size)}>
              {count("watched", props, state.size)}{panel.label}
            </div>
          {/snippet}
        </ResizablePanel>
      {:else}
        <ResizablePanel
          id={panel.value}
          defaultSize={index < 2 ? 25 : undefined}
          class="resizable-panel"
        >
          {#snippet render({ props })}
            <div {...props}>{count("plain", props)}{panel.label}</div>
          {/snippet}
        </ResizablePanel>
      {/if}
    {/each}
  </Resizable>
  <button>After</button>
</div>
