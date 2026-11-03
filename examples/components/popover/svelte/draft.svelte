<script lang="ts">
  import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
  } from "@ui-sdk/svelte/popover"

  let open = $state(false)
  let note = $state("")
  let asking = $state(false)
  let saved = $state(false)
  let field: HTMLTextAreaElement | undefined = $state()

  function close() {
    open = false
    asking = false
  }

  function keepEditing() {
    asking = false
    field?.focus()
  }

  function discard() {
    note = ""
    close()
  }

  function save() {
    saved = true
    note = ""
    close()
  }
</script>

<Popover
  bind:open={() => open, (next) => (next ? (open = true) : close())}
  dismissible={note === ""}
  onDismissAttempt={() => (asking = true)}
>
  <PopoverTrigger>Add note</PopoverTrigger>
  <PopoverContent>
    <PopoverTitle>Note</PopoverTitle>
    <PopoverDescription>Type something, then press Escape or click outside.</PopoverDescription>
    <textarea bind:this={field} bind:value={note} aria-label="Note"></textarea>
    {#if asking}
      <div role="alert" data-slot="row">
        Discard your note?
        <button type="button" data-size="sm" onclick={keepEditing}>Keep editing</button>
        <button type="button" data-size="sm" data-variant="destructive" onclick={discard}>Discard</button>
      </div>
    {:else}
      <button type="button" data-variant="solid" onclick={save}>Save</button>
    {/if}
  </PopoverContent>
</Popover>
<output data-slot="output">{saved ? "Note saved" : "No note yet"}</output>
