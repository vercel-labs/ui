<script lang="ts">
  import {
    Drawer,
    DrawerBackdrop,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
    DrawerTrigger,
  } from "@ui-sdk/svelte/drawer"

  const modes = [
    { value: "true", label: "Modal" },
    { value: "trap-focus", label: "Trap focus" },
    { value: "false", label: "Non-modal" },
  ] as const

  let mode = $state<(typeof modes)[number]["value"]>("false")
  let outside = $state(false)
  const modal = $derived(mode === "true" ? true : mode === "false" ? false : "trap-focus")
</script>

<div data-slot="stack">
  <fieldset data-slot="row">
    <legend>modal</legend>
    {#each modes as option (option.value)}
      <label data-slot="label">
        <input bind:group={mode} type="radio" name="drawer-modal" value={option.value} />
        {option.label}
      </label>
    {/each}
    <label data-slot="label">
      <input bind:checked={outside} type="checkbox" />
      closeOnOutsidePress
    </label>
  </fieldset>
  <Drawer {modal} closeOnOutsidePress={outside}>
    <DrawerTrigger>
      Open notes
    </DrawerTrigger>
    {#if modal === true}
      <DrawerBackdrop />
    {/if}
    <DrawerContent>
      <DrawerTitle>Notes</DrawerTitle>
      <DrawerDescription>
        {modal === false
          ? "The page stays usable. Tab leaves the notes, and Escape closes them while focus is inside."
          : modal === true
            ? "The rest of the page is inert and doesn't scroll."
            : "Tab stays inside, and the page still scrolls and takes clicks."}
      </DrawerDescription>
      <textarea
        aria-label="Notes"
        value="Call the printer about the proofs."
      ></textarea>
      <DrawerClose data-variant="solid">
        Done
      </DrawerClose>
    </DrawerContent>
  </Drawer>
</div>
