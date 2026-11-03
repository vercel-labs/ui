<script lang="ts">
  import { ImageIcon, XIcon } from "@lucide/svelte"
  import {
    FileInput,
    FileInputDropzone,
    FileInputItem,
    FileInputItemRemove,
    FileInputList,
    FileInputTrigger,
    formatFileSize,
    type FileInputChange,
  } from "@ui-sdk/svelte/file-input"

  function announcement({ added, removed, rejected }: FileInputChange) {
    return (
      [
        added.length && `Added ${added.map((file) => file.name).join(", ")}.`,
        removed.length && `Removed ${removed.map((file) => file.name).join(", ")}.`,
        rejected.length && `${rejected.length} skipped, images only.`,
      ]
        .filter(Boolean)
        .join(" ") || null
    )
  }
</script>

<FileInput multiple accept="image/*" {announcement}>
  <FileInputDropzone>
    <span data-slot="hint">Images, announced by name</span>
    <FileInputTrigger>Add images</FileInputTrigger>
  </FileInputDropzone>
  <FileInputList aria-label="Images">
    <FileInputItem>
      {#snippet children(state)}
        <ImageIcon aria-hidden="true" />
        <span>{state.file.name}</span>
        <span data-slot="hint">{formatFileSize(state.file.size)}</span>
        <FileInputItemRemove>
          <XIcon aria-hidden="true" />
        </FileInputItemRemove>
      {/snippet}
    </FileInputItem>
  </FileInputList>
</FileInput>
