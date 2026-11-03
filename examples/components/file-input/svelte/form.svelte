<script lang="ts">
  import { FileIcon, XIcon } from "@lucide/svelte"
  import {
    FileInput,
    FileInputDropzone,
    FileInputItem,
    FileInputItemRemove,
    FileInputList,
    FileInputTrigger,
    formatFileSize,
  } from "@ui-sdk/svelte/file-input"

  const cover = new File(["Dear team,"], "cover-letter.txt", { type: "text/plain" })

  const id = $props.id()
  let sent = $state<string | null>(null)

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    const files = new FormData(event.currentTarget as HTMLFormElement).getAll("attachments") as File[]
    sent =
      files
        .filter((file) => file.name)
        .map((file) => file.name)
        .join(", ") || "no files"
  }
</script>

<div data-slot="stack">
  <FileInput name="attachments" form={id} multiple accept="image/*,.pdf,.txt" defaultValue={[cover]}>
    <FileInputDropzone>
      <span data-slot="hint">Images, PDFs and text</span>
      <FileInputTrigger>Attach</FileInputTrigger>
    </FileInputDropzone>
    <FileInputList aria-label="Attachments">
      <FileInputItem>
        {#snippet children(state)}
          <FileIcon aria-hidden="true" />
          <span>{state.file.name}</span>
          <span data-slot="hint">{formatFileSize(state.file.size)}</span>
          <FileInputItemRemove>
            <XIcon aria-hidden="true" />
          </FileInputItemRemove>
        {/snippet}
      </FileInputItem>
    </FileInputList>
  </FileInput>
  <form {id} data-slot="row" onsubmit={onSubmit} onreset={() => (sent = null)}>
    <button type="submit">Send</button>
    <button type="reset">Reset</button>
    <span data-slot="output">{sent ? `Sent ${sent}.` : ""}</span>
  </form>
</div>
