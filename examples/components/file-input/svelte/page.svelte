<script lang="ts">
  import { FileIcon, UploadIcon, XIcon } from "@lucide/svelte"
  import {
    FileInput,
    FileInputDropzone,
    FileInputItem,
    FileInputItemRemove,
    FileInputList,
    formatFileSize,
  } from "@ui-sdk/svelte/file-input"

</script>

<FileInput multiple>
  <p data-slot="hint">Drag a file anywhere over this page.</p>
  <FileInputDropzone target="document" data-variant="overlay">
    <div data-slot="stack">
      <UploadIcon aria-hidden="true" />
      <p>Drop to attach</p>
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
</FileInput>
