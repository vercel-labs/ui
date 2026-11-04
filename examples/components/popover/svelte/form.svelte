<script lang="ts">
  import { Field, FieldControl, FieldLabel } from "@ui-sdk/svelte/field"
  import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
  } from "@ui-sdk/svelte/popover"
  import { useLog } from "../../../shared/svelte/log"

  const log = useLog()
  let open = $state(false)
</script>

<Popover bind:open>
  <PopoverTrigger>Edit Profile</PopoverTrigger>
  <PopoverContent>
    <PopoverTitle>Edit profile</PopoverTitle>
    <PopoverDescription>Your name shows on your posts.</PopoverDescription>
    <form
      data-slot="stack"
      onsubmit={(event) => {
        event.preventDefault()
        log(`Saved ${new FormData(event.currentTarget).get("name")}`)
        open = false
      }}
    >
      <Field>
        <FieldLabel>Name</FieldLabel>
        <FieldControl name="name" required defaultValue="Hollis Grant" />
      </Field>
      <div data-slot="row">
        <PopoverClose>Cancel</PopoverClose>
        <button type="submit" data-variant="solid">Save</button>
      </div>
    </form>
  </PopoverContent>
</Popover>
