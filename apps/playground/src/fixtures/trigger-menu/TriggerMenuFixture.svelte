<script lang="ts">
  import {
    triggerMenuFixture as f,
    triggerMenuOptions,
  } from "tests/fixtures/trigger-menu.ts"
  import Composer from "./Composer.svelte"

  const { twice } = triggerMenuOptions()
  let action = $state("")
  let open = $state("")
  let submitted = $state("")

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    submitted = String(
      new FormData(event.currentTarget as HTMLFormElement).get("message")
    )
  }
</script>

<div class="fixture">
  <button>Before</button>
  <form class="composer" aria-label={f.formLabel} onsubmit={onSubmit}>
    <Composer
      name={f.label}
      onAction={(value) => (action = value)}
      onOpen={(value) => (open = value)}
    />
    {#if twice}
      <Composer
        name="Second"
        onAction={(value) => (action = value)}
        onOpen={(value) => (open = value)}
      />
    {/if}
    <button type="submit">{f.submit}</button>
  </form>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output role="status" aria-label="Open">{open}</output>
  <output role="status" aria-label="Submitted">{submitted}</output>
</div>
