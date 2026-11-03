<script lang="ts">
  import {
    Autocomplete,
    AutocompleteContent,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteList,
  } from "@ui-sdk/svelte/autocomplete"
  import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/svelte/field"

  const fruits = [
    "Apple",
    "Apricot",
    "Avocado",
    "Banana",
    "Blackberry",
    "Blueberry",
    "Cherry",
    "Grape",
    "Lemon",
    "Mango",
    "Orange",
    "Peach",
    "Pear",
    "Pineapple",
    "Strawberry",
  ]

  let submitted = $state("")

  function submit(event: SubmitEvent) {
    event.preventDefault()
    const data = [...new FormData(event.currentTarget as HTMLFormElement)].map(
      ([name, value]) => `${name}=${value}`,
    )
    submitted = data.join("&")
  }
</script>

<form id="order" data-slot="stack" onsubmit={submit}>
  <Field>
    <FieldLabel>Fruit</FieldLabel>
    <Autocomplete name="fruit" form="order" required defaultValue="Apple">
      <AutocompleteInput />
      <AutocompleteContent>
        <AutocompleteList>
          {#each fruits as fruit (fruit)}
            <AutocompleteItem value={fruit}>
              {fruit}
            </AutocompleteItem>
          {/each}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
    <FieldDescription>Any fruit, listed or not.</FieldDescription>
    <div><FieldError /></div>
  </Field>
  <div data-slot="row">
    <button type="submit" data-variant="solid">
      Submit
    </button>
    <button type="reset">
      Reset
    </button>
  </div>
  <output data-slot="output">{submitted || "Not submitted"}</output>
</form>
