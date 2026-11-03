<script lang="ts">
  import { CheckIcon, ChevronDownIcon } from "@lucide/svelte"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectLabel,
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

  const countries = [
    { value: "ar", label: "Argentina", code: "+54" },
    { value: "au", label: "Australia", code: "+61" },
    { value: "at", label: "Austria", code: "+43" },
    { value: "be", label: "Belgium", code: "+32" },
    { value: "br", label: "Brazil", code: "+55" },
    { value: "ca", label: "Canada", code: "+1" },
    { value: "cl", label: "Chile", code: "+56" },
    { value: "cn", label: "China", code: "+86" },
    { value: "dk", label: "Denmark", code: "+45" },
    { value: "fi", label: "Finland", code: "+358" },
    { value: "fr", label: "France", code: "+33" },
    { value: "de", label: "Germany", code: "+49" },
    { value: "gr", label: "Greece", code: "+30" },
    { value: "in", label: "India", code: "+91" },
    { value: "ie", label: "Ireland", code: "+353" },
    { value: "it", label: "Italy", code: "+39" },
    { value: "jp", label: "Japan", code: "+81" },
    { value: "mx", label: "Mexico", code: "+52" },
    { value: "nl", label: "Netherlands", code: "+31" },
    { value: "no", label: "Norway", code: "+47" },
    { value: "pt", label: "Portugal", code: "+351" },
    { value: "es", label: "Spain", code: "+34" },
    { value: "se", label: "Sweden", code: "+46" },
    { value: "ch", label: "Switzerland", code: "+41" },
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

<div data-slot="stack">
  <form id="select-order" data-slot="stack" onsubmit={submit} onreset={() => (submitted = "")}>
    <Select name="country" autoComplete="country" required placeholder="Select a country">
      <div data-slot="stack">
        <SelectLabel>Country</SelectLabel>
        <SelectTrigger>
          <SelectValue />
          <ChevronDownIcon />
        </SelectTrigger>
      </div>
      <SelectContent>
        {#each countries as country (country.value)}
          <SelectItem value={country.value}>
            {country.label}
            <SelectItemIndicator>
              <CheckIcon />
            </SelectItemIndicator>
          </SelectItem>
        {/each}
      </SelectContent>
    </Select>
    <Select name="fruit" multiple defaultValue={["apple"]}>
      <div data-slot="stack">
        <SelectLabel>Fruits</SelectLabel>
        <SelectTrigger>
          <SelectValue />
          <ChevronDownIcon />
        </SelectTrigger>
      </div>
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
    <div data-slot="row">
      <button type="submit">
        Submit
      </button>
      <button type="reset">
        Reset
      </button>
    </div>
  </form>
  <Select name="size" form="select-order" defaultValue="Medium">
    <div data-slot="stack">
      <SelectLabel>Size</SelectLabel>
      <SelectTrigger>
        <SelectValue />
        <ChevronDownIcon />
      </SelectTrigger>
    </div>
    <SelectContent>
      {#each ["Small", "Medium", "Large"] as size (size)}
        <SelectItem value={size}>
          {size}
          <SelectItemIndicator>
            <CheckIcon />
          </SelectItemIndicator>
        </SelectItem>
      {/each}
    </SelectContent>
  </Select>
  <output data-slot="output">{submitted || "Submit the form"}</output>
</div>
