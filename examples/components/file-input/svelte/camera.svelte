<script lang="ts">
  import { SmartphoneIcon } from "@lucide/svelte"
  import { FileInput, FileInputTrigger } from "@ui-sdk/svelte/file-input"

</script>

<FileInput accept="image/*" capture="environment">
  {#snippet children(state)}
    <FileInputTrigger>
      <SmartphoneIcon aria-hidden="true" />
      Take a photo
    </FileInputTrigger>
    <span data-slot="hint">{state.value[0]?.name ?? "No photo yet"}</span>
  {/snippet}
</FileInput>
