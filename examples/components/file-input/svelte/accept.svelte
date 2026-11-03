<script lang="ts">
  import { FileIcon, ImageIcon, XIcon } from "@lucide/svelte"
  import {
    FileInput,
    FileInputDropzone,
    FileInputItem,
    FileInputItemRemove,
    FileInputList,
    FileInputTrigger,
    formatFileSize,
    type FileRejection,
  } from "@ui-sdk/svelte/file-input"

  const messages: Record<string, string> = {
    "file-type": "isn't a supported type",
  }

  let rejected = $state<FileRejection[]>([])
</script>

<FileInput
  multiple
  accept={["image/*", ".pdf"]}
  onValueChange={() => (rejected = [])}
  onReject={(next) => (rejected = next)}
>
  <FileInputDropzone>
    <ImageIcon aria-hidden="true" />
    <span data-slot="hint">Images and PDFs</span>
    <FileInputTrigger>Browse</FileInputTrigger>
  </FileInputDropzone>
  <FileInputList aria-label="Files">
    <FileInputItem>
      {#snippet children(state)}
        {#if state.file.type.startsWith("image/")}
          <ImageIcon aria-hidden="true" />
        {:else}
          <FileIcon aria-hidden="true" />
        {/if}
        <span>{state.file.name}</span>
        <span data-slot="hint">{formatFileSize(state.file.size)}</span>
        <FileInputItemRemove>
          <XIcon aria-hidden="true" />
        </FileInputItemRemove>
      {/snippet}
    </FileInputItem>
  </FileInputList>
  <div data-slot="output">{#each rejected as { file, reasons }, index (index)}
    <p>{file.name} {messages[reasons[0]] ?? "was rejected"}</p>
  {/each}</div>
</FileInput>
