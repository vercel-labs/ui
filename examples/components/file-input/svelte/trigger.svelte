<script lang="ts">
  import { UploadIcon } from "@lucide/svelte"
  import { FileInput, FileInputTrigger } from "@ui-sdk/svelte/file-input"

</script>

<FileInput>
  {#snippet children(state)}
    <FileInputTrigger>
      <UploadIcon aria-hidden="true" />
      Upload a file
    </FileInputTrigger>
    <span data-slot="hint">{state.value[0]?.name ?? "No file chosen"}</span>
  {/snippet}
</FileInput>
