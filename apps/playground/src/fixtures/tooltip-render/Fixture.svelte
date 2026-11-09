<script lang="ts">
  import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/svelte"
</script>

<div class="fixture tooltip-page">
  <button>Before</button>
  <Tooltip delay={100}>
    <TooltipTrigger href="#docs">
      {#snippet render({ props })}
        <a {...props}>Docs</a>
      {/snippet}
    </TooltipTrigger>
    <TooltipContent class="tooltip">Read the docs</TooltipContent>
  </Tooltip>
  <Tooltip delay={100}>
    <TooltipTrigger>
      {#snippet render({ props, state })}
        <button {...props} class={state.open ? "is-open" : "is-closed"}>
          Status <span aria-hidden="true">{state.open ? "●" : "○"}</span>
        </button>
      {/snippet}
    </TooltipTrigger>
    <TooltipContent>
      {#snippet render({ props, state })}
        <div {...props} class={state.open ? "tooltip is-open" : "tooltip"}>
          All systems normal
        </div>
      {/snippet}
    </TooltipContent>
  </Tooltip>
  <button>After</button>
</div>
