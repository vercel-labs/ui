<script lang="ts">
  import { Button, Separator, Toggle, ToggleGroup } from "@ui-sdk/svelte"

  let action = $state("")
</script>

<div class="fixture">
  <button>Before</button>
  <Button class="button" onclick={() => (action = "span")}>
    {#snippet render({ props })}
      <span {...props}>Span button</span>
    {/snippet}
  </Button>
  <Button class="button" disabled href="#old">
    {#snippet render({ props })}
      <a {...props}>Old docs</a>
    {/snippet}
  </Button>
  <Toggle onPressedChange={(pressed) => (action = pressed ? "star" : "unstar")}>
    {#snippet render({ props, state })}
      <button
        {...props}
        class={["toggle", state.pressed ? "is-pressed" : "is-unpressed"]}
      >
        <span aria-hidden="true">{state.pressed ? "★" : "☆"}</span> Star
      </button>
    {/snippet}
  </Toggle>
  <ToggleGroup
    class="toggle-group"
    aria-label="View"
    defaultValue={["grid"]}
    onValueChange={(value) => (action = value.join(", "))}
  >
    <Toggle class="toggle" value="grid">
      {#snippet render({ props })}
        <span {...props}>Grid</span>
      {/snippet}
    </Toggle>
    <Toggle class="toggle" value="list">
      {#snippet render({ props })}
        <span {...props}>List</span>
      {/snippet}
    </Toggle>
  </ToggleGroup>
  <Separator class="rule">
    {#snippet render({ props })}
      <hr {...props} />
    {/snippet}
  </Separator>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
