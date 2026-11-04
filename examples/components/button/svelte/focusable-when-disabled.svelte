<script lang="ts">
  import { Button } from "@ui-sdk/svelte/button"
  import { Field, FieldControl, FieldLabel } from "@ui-sdk/svelte/field"
  import { useLog } from "../../../shared/svelte/log"

  const log = useLog()
  let title = $state("")
  const hint = $props.id()
  const ready = $derived(title.trim() !== "")
</script>

<div data-slot="stack">
  <Field>
    <FieldLabel>Title</FieldLabel>
    <FieldControl value={title} oninput={(event) => (title = event.currentTarget.value)} />
  </Field>
  <div data-slot="row">
    <Button
      disabled={!ready}
      focusableWhenDisabled
      aria-describedby={hint}
      onclick={() => log(`Published “${title}”`)}
    >
      Publish
    </Button>
    <p id={hint} data-slot="hint">{ready ? "Ready to publish." : "Add a title to publish."}</p>
  </div>
</div>
