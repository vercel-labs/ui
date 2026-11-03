<script lang="ts">
  import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/svelte/field"
  import { FileInput, FileInputDropzone, FileInputTrigger } from "@ui-sdk/svelte/file-input"

  let sent = $state(false)

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    sent = true
  }
</script>

<form data-slot="stack" onsubmit={onSubmit} onreset={() => (sent = false)}>
  <Field>
    <FieldLabel>Proof of address</FieldLabel>
    <FileInput name="proof" required accept={["image/*", ".pdf"]}>
      {#snippet children(state)}
        <FileInputDropzone>
          <span data-slot="hint">{state.value[0]?.name ?? "Drop a scan here"}</span>
          <FileInputTrigger>{state.value[0] ? "Replace" : "Choose a file"}</FileInputTrigger>
        </FileInputDropzone>
      {/snippet}
    </FileInput>
    <FieldDescription>A utility bill or bank statement from the last 3 months.</FieldDescription>
    <div><FieldError match="valueMissing">Add a scan to continue.</FieldError></div>
  </Field>
  <div data-slot="row">
    <button type="submit">Continue</button>
    <button type="reset">Reset</button>
    <span data-slot="output">{sent ? "Sent." : ""}</span>
  </div>
</form>
