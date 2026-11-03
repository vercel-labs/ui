<script lang="ts">
  import { PlusIcon, XIcon } from "@lucide/svelte"
  import {
    FileInput,
    FileInputItem,
    FileInputItemRemove,
    FileInputList,
    FileInputTrigger,
    formatFileSize,
  } from "@ui-sdk/svelte/file-input"

  const preview = (file: File) => (img: HTMLImageElement) => {
    const url = URL.createObjectURL(file)
    img.src = url
    return () => URL.revokeObjectURL(url)
  }
</script>

<FileInput multiple accept="image/*">
  <FileInputTrigger>
    <PlusIcon aria-hidden="true" />
    Add images
  </FileInputTrigger>
  <FileInputList aria-label="Images" data-variant="grid">
    <FileInputItem>
      {#snippet children(state)}
        <img {@attach preview(state.file)} alt="" />
        <span>{state.index + 1}. {state.file.name}, {formatFileSize(state.file.size)}</span>
        <FileInputItemRemove>
          <XIcon aria-hidden="true" />
        </FileInputItemRemove>
      {/snippet}
    </FileInputItem>
  </FileInputList>
</FileInput>
