<script lang="ts">
  import { FileIcon } from "@lucide/svelte"
  import { FileInput, FileInputDropzone, FileInputTrigger, formatFileSize } from "@ui-sdk/svelte/file-input"

</script>

<FileInput accept=".pdf">
  {#snippet children(state)}
    <FileInputDropzone>
      <FileIcon aria-hidden="true" />
      <span data-slot="hint">
        {state.value[0] ? `${state.value[0].name}, ${formatFileSize(state.value[0].size)}` : "Drop one PDF"}
      </span>
      <FileInputTrigger>{state.value[0] ? "Replace" : "Choose"}</FileInputTrigger>
    </FileInputDropzone>
  {/snippet}
</FileInput>
