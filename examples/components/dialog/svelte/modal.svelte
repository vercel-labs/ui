<script lang="ts">
  import {
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
  } from "@ui-sdk/svelte/dialog"

  const modes = [
    { value: "true", label: "Modal" },
    { value: "trap-focus", label: "Trap focus" },
    { value: "false", label: "Non-modal" },
  ] as const

  const notes = {
    true: "The rest of the page is inert and doesn't scroll.",
    "trap-focus": "Tab stays inside, and the page still scrolls and takes clicks.",
    false: "The page stays usable. Tab leaves the notes, and Escape closes them while focus is inside.",
  }

  let mode = $state<(typeof modes)[number]["value"]>("false")
  let outside = $state(false)
  const modal = $derived(mode === "true" ? true : mode === "false" ? false : "trap-focus")
</script>

<div data-slot="stack">
  <fieldset data-slot="row">
    <legend>modal</legend>
    {#each modes as option (option.value)}
      <label data-slot="label">
        <input bind:group={mode} type="radio" name="modal" value={option.value} />
        {option.label}
      </label>
    {/each}
    <label data-slot="label">
      <input bind:checked={outside} type="checkbox" />
      closeOnOutsidePress
    </label>
  </fieldset>
  <Dialog {modal} closeOnOutsidePress={outside}>
    <DialogTrigger>
      Open notes
    </DialogTrigger>
    {#if modal === true}
      <DialogBackdrop />
    {/if}
    <DialogContent>
      <div data-slot="stack">
        <DialogTitle>Notes</DialogTitle>
        <DialogDescription>{notes[mode]}</DialogDescription>
      </div>
      <textarea
        aria-label="Notes"
        value="Call the printer about the proofs."
      ></textarea>
      <DialogClose>
        Done
      </DialogClose>
    </DialogContent>
  </Dialog>
</div>
