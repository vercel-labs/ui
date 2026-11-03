<script lang="ts">
  import { FileIcon, XIcon } from "@lucide/svelte"
  import {
    createFileInputController,
    FileInput,
    FileInputItem,
    FileInputItemRemove,
    FileInputList,
    formatFileSize,
  } from "@ui-sdk/svelte/file-input"

  const controller = createFileInputController()

  function addNote() {
    controller.addFiles([new File(["hello"], `note-${Date.now()}.txt`, { type: "text/plain" })])
  }
</script>

<div data-slot="stack">
  <div data-slot="row">
    <button type="button" onclick={() => controller.open()}>Open the picker</button>
    <button type="button" onclick={addNote}>Add a note</button>
    <button type="button" onclick={() => controller.clear()}>Clear</button>
  </div>
  <FileInput multiple {controller}>
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
</div>
