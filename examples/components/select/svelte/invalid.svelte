<script lang="ts">
  import { CheckIcon, ChevronDownIcon } from "@lucide/svelte"
  import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/svelte/field"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectTrigger,
    SelectValue,
  } from "@ui-sdk/svelte/select"

  const fruits = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "grapes", label: "Grapes" },
    { value: "pineapple", label: "Pineapple" },
  ]

  let submitted = $state("")

  function submit(event: SubmitEvent) {
    event.preventDefault()
    submitted = `Ordered ${new FormData(event.currentTarget as HTMLFormElement).get("fruit")}.`
  }
</script>

<form data-slot="stack" onsubmit={submit}>
  <Field name="fruit">
    <FieldLabel>Fruit</FieldLabel>
    <Select required placeholder="Select a fruit">
      <SelectTrigger>
        <SelectValue />
        <ChevronDownIcon />
      </SelectTrigger>
      <SelectContent>
        {#each fruits as fruit (fruit.value)}
          <SelectItem value={fruit.value}>
            {fruit.label}
            <SelectItemIndicator>
              <CheckIcon />
            </SelectItemIndicator>
          </SelectItem>
        {/each}
      </SelectContent>
    </Select>
    <FieldDescription>We deliver it tomorrow.</FieldDescription>
    <FieldError match="valueMissing">Pick a fruit to order.</FieldError>
  </Field>
  <button type="submit">
    Order
  </button>
  <output data-slot="output">{submitted}</output>
</form>
