<script lang="ts">
  import { CheckIcon, ImageIcon, XIcon } from "@lucide/svelte"
  import {
    FileInput,
    FileInputDropzone,
    FileInputItem,
    FileInputItemRemove,
    FileInputList,
    FileInputTrigger,
  } from "@ui-sdk/svelte/file-input"

</script>

<FileInput multiple accept="image/*" maxFiles={4}>
  <FileInputDropzone>
    {#snippet render({ props, state })}
      <section {...props} aria-label="Gallery upload">
        {#if state.dragReject}
          <XIcon />
        {:else if state.dragAccept}
          <CheckIcon />
        {:else}
          <ImageIcon />
        {/if}
        <p>
          {state.dragReject ? "Only up to 4 images" : state.dragAccept ? "Release to add" : "Drag up to 4 images here"}
        </p>
        {#if !state.dragging}
          <FileInputTrigger>Browse</FileInputTrigger>
        {/if}
      </section>
    {/snippet}
  </FileInputDropzone>
  <FileInputList aria-label="Images" data-variant="chips">
    {#snippet render({ props, state, children })}
      <ul {...props}>{@render children?.(state)}</ul>
    {/snippet}
    <FileInputItem>
      {#snippet render({ props, state })}
        <li {...props}>
          {#if state.index === 0}
            <span data-show="first">Cover:</span>
          {/if}
          <span>{state.file.name}</span>
          <FileInputItemRemove>
            {#snippet render({ props: removeProps })}
              <button {...removeProps}>
                <XIcon />
              </button>
            {/snippet}
          </FileInputItemRemove>
        </li>
      {/snippet}
    </FileInputItem>
  </FileInputList>
</FileInput>
