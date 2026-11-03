<script lang="ts">
  import { createToolbarController, Toolbar, ToolbarButton } from "@ui-sdk/svelte/toolbar"

  const toolbar = createToolbarController()

  let action = $state("nothing yet")

  function onKeydown(event: KeyboardEvent) {
    if (event.altKey && event.key === "F10") toolbar.focus()
  }
</script>

<svelte:window onkeydown={onKeydown} />

<div data-slot="stack">
  <textarea
    aria-label="Notes"
    placeholder="Type, then press Alt+F10"
  ></textarea>
  <Toolbar controller={toolbar} aria-label="Notes">
    {#each ["Bold", "Italic", "Link"] as label (label)}
      <ToolbarButton data-variant="secondary" onclick={() => (action = label.toLowerCase())}>
        {label}
      </ToolbarButton>
    {/each}
  </Toolbar>
  <div data-slot="row">
    <button data-variant="secondary" type="button" onclick={() => toolbar.focus()}>
      Focus toolbar
    </button>
    <output data-slot="output">Last: {action}</output>
  </div>
</div>
