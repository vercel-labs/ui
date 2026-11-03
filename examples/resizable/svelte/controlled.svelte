<script lang="ts">
  import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/svelte/resizable"

  let layout = $state([30, 70])
</script>

<div class="flex w-full max-w-md flex-col gap-3">
  <Resizable
    bind:layout
    class="h-50 w-full rounded-2xl border border-border"
  >
    <ResizablePanel
      minSize={20}
      class="flex items-center justify-center p-6 text-sm font-medium"
    >Files</ResizablePanel>
    <ResizableHandle
      aria-label="Resize files"
      class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full"
    />
    <ResizablePanel
      minSize={20}
      class="flex items-center justify-center p-6 text-sm font-medium"
    >Editor</ResizablePanel>
  </Resizable>
  <div class="flex flex-wrap gap-2">
    <button
      type="button"
      class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground outline-none select-none transition-colors hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:translate-y-px motion-reduce:transition-none motion-reduce:transform-none"
      onclick={() => (layout = [20, 80])}
    >
      Narrow
    </button>
    <button
      type="button"
      class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground outline-none select-none transition-colors hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:translate-y-px motion-reduce:transition-none motion-reduce:transform-none"
      onclick={() => (layout = [50, 50])}
    >
      Even
    </button>
  </div>
  <output class="text-sm text-muted-foreground tabular-nums">{layout.map(Math.round).join(" / ")}</output>
</div>
