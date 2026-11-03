<script lang="ts">
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"
  import { Input, createInputController } from "@ui-sdk/svelte/input"

  const message = createInputController()
</script>

<div data-slot="stack">
  <Field name="message">
    <FieldLabel>
      Message
    </FieldLabel>
    <Input
      controller={message}

      placeholder="Say something"
    />
  </Field>
  <div data-slot="row">
    <button type="button" onclick={() => (message.setValue('On my way!'))}>
      Quick reply
    </button>
    <button type="button" onclick={() => (message.clear())}>
      Clear
    </button>
    <button type="button" onclick={() => (message.focus())}>
      Focus
    </button>
  </div>
</div>
