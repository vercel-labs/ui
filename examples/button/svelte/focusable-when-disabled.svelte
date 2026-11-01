<script lang="ts">
  import { Button } from "@ui-sdk/svelte/button"
  let title = $state("")
  let published = $state(false)
  const hint = $props.id()
  const ready = $derived(title.trim() !== "")
</script>

<div data-slot="stack">
  <label data-slot="label">
    Title
    <input
      bind:value={title}
      oninput={() => (published = false)}
    />
  </label>
  <div data-slot="row">
    <Button
      disabled={!ready}
      focusableWhenDisabled
      aria-describedby={hint}
      onclick={() => (published = true)}
    >Publish</Button>
    <p
      id={hint}
    >{!ready ? "Add a title to publish." : published ? "Published." : "Ready to publish."}</p>
  </div>
</div>
