<script lang="ts">
  import { CheckIcon, ChevronDownIcon } from "@lucide/svelte"
  import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxList,
    ComboboxTrigger,
  } from "@ui-sdk/svelte/combobox"
  import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/svelte/field"

  const countries = [
    { value: "ar", label: "Argentina" },
    { value: "au", label: "Australia" },
    { value: "at", label: "Austria" },
    { value: "be", label: "Belgium" },
    { value: "br", label: "Brazil" },
    { value: "ca", label: "Canada" },
    { value: "cl", label: "Chile" },
    { value: "dk", label: "Denmark" },
    { value: "fi", label: "Finland" },
    { value: "fr", label: "France" },
    { value: "de", label: "Germany" },
    { value: "gr", label: "Greece" },
    { value: "jp", label: "Japan" },
    { value: "nl", label: "Netherlands" },
    { value: "es", label: "Spain" },
    { value: "se", label: "Sweden" },
    { value: "ch", label: "Switzerland" },
  ]

  let submitted = $state("")

  function submit(event: SubmitEvent) {
    event.preventDefault()
    submitted = `Shipping to ${new FormData(event.currentTarget as HTMLFormElement).get("country")}.`
  }
</script>

<form data-slot="stack" onsubmit={submit}>
  <Field name="country">
    <FieldLabel>Country</FieldLabel>
    <Combobox required>
      <div data-slot="row">
        <ComboboxInput placeholder="Search countries" />
        <ComboboxTrigger aria-label="Show countries">
          <ChevronDownIcon aria-hidden="true" />
        </ComboboxTrigger>
      </div>
      <ComboboxContent>
        <ComboboxEmpty>No countries found.</ComboboxEmpty>
        <ComboboxList>
          {#each countries as country (country.value)}
            <ComboboxItem value={country.value} label={country.label}>
              {country.label}
              <ComboboxItemIndicator>
                <CheckIcon aria-hidden="true" />
              </ComboboxItemIndicator>
            </ComboboxItem>
          {/each}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
    <FieldDescription>Where we ship your order.</FieldDescription>
    <div>
        <FieldError match="valueMissing">Choose a country.</FieldError>
      </div>
  </Field>
  <button type="submit" data-variant="solid">
    Continue
  </button>
  <output data-slot="output">{submitted}</output>
</form>
