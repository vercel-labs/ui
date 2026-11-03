<script lang="ts">
  import { UserIcon } from "@lucide/svelte"
  import { FileInput, FileInputDropzone, FileInputTrigger } from "@ui-sdk/svelte/file-input"

  let value = $state<File[]>([])
  let url = $state<string | null>(null)

  $effect(() => {
    const file = value[0]
    if (!file) {
      url = null
      return
    }
    const shown = URL.createObjectURL(file)
    url = shown
    return () => URL.revokeObjectURL(shown)
  })
</script>

<FileInput bind:value accept="image/*" maxSize={5_000_000}>
  <FileInputDropzone data-variant="avatar">
    {#if url}
      <img src={url} alt="" />
    {:else}
      <UserIcon aria-hidden="true" />
    {/if}
  </FileInputDropzone>
  <div data-slot="stack">
    <div data-slot="row">
      <FileInputTrigger>{url ? "Change photo" : "Upload photo"}</FileInputTrigger>
      {#if url}
        <button type="button" onclick={() => (value = [])}>Remove</button>
      {/if}
    </div>
    <p data-slot="hint">Or drop an image on the avatar. Up to 5 MB.</p>
  </div>
</FileInput>
