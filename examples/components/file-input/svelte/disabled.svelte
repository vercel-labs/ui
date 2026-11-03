<script lang="ts">
  import { FileInput, FileInputDropzone, FileInputTrigger } from "@ui-sdk/svelte/file-input"

</script>

<FileInput disabled>
  <FileInputDropzone>
    <span data-slot="hint">Uploads are paused</span>
    <FileInputTrigger>Browse</FileInputTrigger>
  </FileInputDropzone>
</FileInput>
