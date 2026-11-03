<script lang="ts">
  import { FileIcon, ImageIcon, PlusIcon, XIcon } from "@lucide/svelte"
  import {
    createFileInputController,
    FileInput,
    FileInputDropzone,
    FileInputItem,
    FileInputItemRemove,
    FileInputList,
    FileInputTrigger,
  } from "@ui-sdk/svelte/file-input"

  const controller = createFileInputController()
  let text = $state("")
  let input = $state<HTMLTextAreaElement | null>(null)

  function onKeydown(event: KeyboardEvent, value: readonly File[]) {
    const last = value.at(-1)
    if (event.key !== "Backspace" || text !== "" || !last) return
    event.preventDefault()
    controller.removeFile(last, { reason: "remove-press" })
  }

  function send() {
    text = ""
    controller.clear()
  }
</script>

<FileInput multiple accept={["image/*", ".pdf", ".txt", ".md"]} maxSize={10_000_000} {controller}>
  {#snippet children(state)}
    <FileInputDropzone pasteTarget={() => input}>
      <FileInputList aria-label="Attachments" data-variant="chips">
        <FileInputItem>
          {#snippet children(item)}
            {#if item.file.type.startsWith("image/")}
              <ImageIcon aria-hidden="true" />
            {:else}
              <FileIcon aria-hidden="true" />
            {/if}
            <span>{item.file.name}</span>
            <FileInputItemRemove>
              <XIcon aria-hidden="true" />
            </FileInputItemRemove>
          {/snippet}
        </FileInputItem>
      </FileInputList>
      <textarea
        bind:this={input}
        bind:value={text}
        aria-label="Message"
        placeholder="Ask anything. Paste or drop files to attach them."
        onkeydown={(event) => onKeydown(event, state.value)}
      ></textarea>
      <div data-slot="row">
        <FileInputTrigger aria-label="Attach files">
          <PlusIcon aria-hidden="true" />
        </FileInputTrigger>
        <button type="button" disabled={!text && !state.value.length} onclick={send}>Send</button>
      </div>
    </FileInputDropzone>
  {/snippet}
</FileInput>
