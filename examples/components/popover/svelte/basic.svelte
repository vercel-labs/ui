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
</script>

<Popover>
  <PopoverTrigger>Share</PopoverTrigger>
  <PopoverContent>
    <PopoverTitle>Share this document</PopoverTitle>
    <PopoverDescription>Anyone with the link can view it.</PopoverDescription>
    <Field>
      <FieldLabel>Link</FieldLabel>
      <FieldControl readonly defaultValue="acme.app/d/q3-roadmap" />
    </Field>
    <div data-slot="row">
      <PopoverClose>Cancel</PopoverClose>
      <PopoverClose data-variant="solid">Copy Link</PopoverClose>
    </div>
  </PopoverContent>
</Popover>
