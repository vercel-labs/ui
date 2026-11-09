<script lang="ts">
  import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/svelte"
  import { countRender, perfSize } from "tests/fixtures/perf.ts"

  // N tooltip triggers in a row, like a toolbar of icon buttons, for the
  // counts specs. Keyboard focus opens a tooltip at once, so
  // Tab shows each in turn. Triggers and contents count their updates, so
  // specs can tell what a focus move rendered. An update is the part's props
  // changing, which the text reads so it counts them.
  const tips = Array.from({ length: perfSize() }, (_, index) => index + 1)
  const count = (kind: "trigger" | "tooltip", ...reads: unknown[]) => (
    countRender(kind),
    ""
  )
</script>

<div class="fixture tooltip-page" style="flex-wrap: wrap">
  <button>Before</button>
  {#each tips as tip (tip)}
    <div class="tooltip-row">
      <Tooltip delay={0}>
        <TooltipTrigger class="tooltip-trigger">
          {#snippet render({ props })}
            <button {...props}>{count("trigger", props)}Tip {tip}</button>
          {/snippet}
        </TooltipTrigger>
        <TooltipContent class="tooltip">
          {#snippet render({ props })}
            <div {...props}>{count("tooltip", props)}Hint {tip}</div>
          {/snippet}
        </TooltipContent>
      </Tooltip>
    </div>
  {/each}
  <button>After</button>
</div>
