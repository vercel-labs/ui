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
    type FileInputValueChangeDetails,
  } from "@ui-sdk/svelte/file-input"

  let files = $state<File[]>([])
  let last = $state("Nothing yet")

  function onValueChange(value: File[], details: FileInputValueChangeDetails) {
    files = value
    last = `${details.reason}: +${details.added.length} -${details.removed.length}`
  }
</script>

<FileInput multiple value={files} {onValueChange}>
  <FileInputDropzone>
    <span data-slot="hint">{files.length} {files.length === 1 ? "file" : "files"}</span>
    <div data-slot="row">
      <FileInputTrigger>Add</FileInputTrigger>
      <button type="button" disabled={!files.length} onclick={() => (files = files.slice(0, -1))}>
        Remove last
      </button>
    </div>
  </FileInputDropzone>
  <FileInputList aria-label="Files">
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
  <output data-slot="output">{last}</output>
</FileInput>
