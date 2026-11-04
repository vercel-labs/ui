<script lang="ts">
  import { CheckIcon, ChevronDownIcon } from "@lucide/svelte"
  import { Field, FieldControl, FieldLabel } from "@ui-sdk/svelte/field"
  import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
  } from "@ui-sdk/svelte/popover"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@ui-sdk/svelte/select"

  const modes = [
    { value: "false", label: "Non-modal" },
    { value: "trap-focus", label: "Trap focus" },
    { value: "true", label: "Modal" },
  ]

  type Mode = "false" | "trap-focus" | "true"

  const notes = {
    false: "Tab can leave, and focus leaving closes it.",
    "trap-focus": "Tab stays inside. The page still scrolls and takes clicks.",
    true: "Tab stays inside. The page is inert and doesn't scroll.",
  }

  let mode = $state<Mode>("false")
  const modal = $derived(mode === "true" ? true : mode === "false" ? false : "trap-focus")
</script>

<div data-slot="stack">
  <div data-slot="controls">
    <Select items={modes} value={mode} onValueChange={(next) => next && (mode = next as Mode)}>
      <SelectLabel>Modal</SelectLabel>
      <SelectTrigger>
        <SelectValue />
        <ChevronDownIcon aria-hidden="true" />
      </SelectTrigger>
      <SelectContent>
        {#each modes as option (option.value)}
          <SelectItem value={option.value}>
            {option.label}
            <SelectItemIndicator>
              <CheckIcon aria-hidden="true" />
            </SelectItemIndicator>
          </SelectItem>
        {/each}
      </SelectContent>
    </Select>
  </div>
  <Popover {modal}>
    <PopoverTrigger>Add Comment</PopoverTrigger>
    <PopoverContent>
      <PopoverTitle>Add a comment</PopoverTitle>
      <PopoverDescription>{notes[mode]}</PopoverDescription>
      <Field>
        <FieldLabel>Comment</FieldLabel>
        <FieldControl defaultValue="Looks good to me.">
          {#snippet render({ props })}
            <textarea {...props}></textarea>
          {/snippet}
        </FieldControl>
      </Field>
      <div data-slot="row">
        <PopoverClose>Cancel</PopoverClose>
        <PopoverClose data-variant="solid">Comment</PopoverClose>
      </div>
    </PopoverContent>
  </Popover>
</div>
