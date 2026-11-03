<script lang="ts">
  import { FolderIcon } from "@lucide/svelte"
  import {
    FileInput,
    FileInputDropzone,
    FileInputItem,
    FileInputList,
    FileInputTrigger,
    relativePath,
  } from "@ui-sdk/svelte/file-input"

</script>

<FileInput directory>
  <FileInputDropzone>
    <FolderIcon aria-hidden="true" />
    <span data-slot="hint">Drop a folder</span>
    <FileInputTrigger>Choose a folder</FileInputTrigger>
  </FileInputDropzone>
  <FileInputList aria-label="Files">
    <FileInputItem>{#snippet children(state)}{relativePath(state.file)}
  {/snippet}
</FileInputItem>
  </FileInputList>
</FileInput>
