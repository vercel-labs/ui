<script lang="ts">
  import { CheckIcon } from "@lucide/svelte"
  import { Checkbox, CheckboxIndicator } from "@ui-sdk/svelte/checkbox"
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

<div data-slot="stack">
  <div data-slot="controls">
    <label data-slot="label">
      <Checkbox checked={open} onCheckedChange={(next) => (open = next === true)}>
        <CheckboxIndicator>
          <CheckIcon aria-hidden="true" />
        </CheckboxIndicator>
      </Checkbox>
      Open
    </label>
  </div>
  <Popover
    bind:open
    onOpenChange={(next, details) => log(`${next ? "Opened" : "Closed"} (${details.reason})`)}
  >
    <PopoverTrigger>Set Status</PopoverTrigger>
    <PopoverContent>
      <PopoverTitle>Set a status</PopoverTitle>
      <PopoverDescription>Your team sees it next to your name.</PopoverDescription>
      <Field>
        <FieldLabel>Status</FieldLabel>
        <FieldControl defaultValue="In a meeting" />
      </Field>
      <div data-slot="row">
        <PopoverClose>Cancel</PopoverClose>
        <PopoverClose data-variant="solid">Save</PopoverClose>
      </div>
    </PopoverContent>
  </Popover>
</div>
