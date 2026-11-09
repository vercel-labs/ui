<script lang="ts">
  import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTitle,
    PopoverTrigger,
  } from "@ui-sdk/svelte"
</script>

<div class="fixture">
  <button>Before</button>
  <Popover>
    <PopoverTrigger>
      {#snippet render({ props, state })}
        <button {...props} class={state.open ? "is-open" : "is-closed"}>
          Details <span aria-hidden="true">{state.open ? "▲" : "▼"}</span>
        </button>
      {/snippet}
    </PopoverTrigger>
    <PopoverContent class="popup">
      <PopoverTitle>
        {#snippet render({ props })}
          <h3 {...props}>Shipping</h3>
        {/snippet}
      </PopoverTitle>
      <PopoverClose href="#done">
        {#snippet render({ props })}
          <a {...props}>Done</a>
        {/snippet}
      </PopoverClose>
    </PopoverContent>
  </Popover>
  <button>After</button>
</div>
