<script lang="ts">
  import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
  } from "@ui-sdk/svelte/popover"

  let open = $state(false)
  let name = $state("Ada Lovelace")
  let saved = $state("")

  function save(event: SubmitEvent) {
    event.preventDefault()
    saved = name
    open = false
  }
</script>

<Popover bind:open>
  <PopoverTrigger>Edit profile</PopoverTrigger>
  <PopoverContent>
    <PopoverTitle>Profile</PopoverTitle>
    <PopoverDescription>Your name appears on your posts.</PopoverDescription>
    <form data-slot="stack" onsubmit={save}>
      <label data-slot="label">
        Name
        <input bind:value={name} />
      </label>
      <button type="submit" data-variant="solid">Save</button>
    </form>
  </PopoverContent>
</Popover>
<output data-slot="output">{saved ? `Saved ${saved}` : "Not saved yet"}</output>
