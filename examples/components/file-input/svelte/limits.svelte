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
    type FileRejection,
  } from "@ui-sdk/svelte/file-input"

  const messages: Record<string, string> = {
    "file-too-large": "is too large",
    "file-too-small": "is empty",
    "too-many-files": "is one file too many",
  }

  let rejected = $state<FileRejection[]>([])
</script>

<FileInput
  multiple
  maxFiles={3}
  maxSize={5_000_000}
  minSize={1}
  onValueChange={() => (rejected = [])}
  onReject={(next) => (rejected = next)}
>
  {#snippet children(state)}
    <FileInputDropzone>
      <span data-slot="hint">{state.value.length} of 3 files, up to 5 MB each</span>
      <FileInputTrigger>Add files</FileInputTrigger>
    </FileInputDropzone>
    <FileInputList aria-label="Files">
      <FileInputItem>
        {#snippet children(item)}
          <FileIcon aria-hidden="true" />
          <span>{item.file.name}</span>
          <span data-slot="hint">{formatFileSize(item.file.size)}</span>
          <FileInputItemRemove>
            <XIcon aria-hidden="true" />
          </FileInputItemRemove>
        {/snippet}
      </FileInputItem>
    </FileInputList>
    <div data-slot="output">{#each rejected as { file, reasons }, index (index)}
      <p>
        {file.name} {reasons.map((reason) => messages[reason] ?? reason).join(" and ")}
      </p>
    {/each}</div>
  {/snippet}
</FileInput>
