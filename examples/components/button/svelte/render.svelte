<script lang="ts">
  import { Button } from "@ui-sdk/svelte/button"
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
  let fail = $state(false)

  async function save() {
    await wait(1000)
    if (fail) {
      throw new Error("Couldn't save. Check your connection and try again.")
    }
  }
</script>

<div data-slot="stack">
  <label data-slot="label">
    <input
      bind:checked={fail}
      type="checkbox"
    />
    Make saving fail
  </label>
  <Button
    onclick={save}
  >
    {#snippet render({ props, state })}
      <div data-slot="stack">
        <button {...props}>{state.pending ? "Saving…" : state.error ? "Try again" : "Save changes"}</button>
        <p
          data-slot="output"
          role="alert"
        >{state.error instanceof Error ? state.error.message : ""}</p>
      </div>
    {/snippet}
  </Button>
</div>
