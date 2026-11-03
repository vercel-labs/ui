<script lang="ts">
  import { FileIcon, XIcon } from "@lucide/svelte"
  import {
    createFileInputController,
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
    duplicate: "is already added",
  }

  const controller = createFileInputController()
  let rejected = $state<FileRejection[]>([])

  function validate(file: File) {
    return controller.getValue().some((other) => other.name === file.name) ? "duplicate" : null
  }
</script>

<FileInput
  multiple
  {controller}
  {validate}
  onValueChange={() => (rejected = [])}
  onReject={(next) => (rejected = next)}
>
  <FileInputDropzone>
    <span data-slot="hint">Each name once</span>
    <FileInputTrigger>Add files</FileInputTrigger>
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
  <div data-slot="output">{#each rejected as { file, reasons }, index (index)}
    <p>{file.name} {messages[reasons[0]] ?? "was rejected"}</p>
  {/each}</div>
</FileInput>
