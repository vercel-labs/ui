<script lang="ts">
  import { CheckIcon, ChevronDownIcon } from "@lucide/svelte"
  import {
    Combobox,
    ComboboxContent,
    ComboboxGroup,
    ComboboxGroupLabel,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxLabel,
    ComboboxList,
    ComboboxSeparator,
    ComboboxTrigger,
  } from "@ui-sdk/svelte/combobox"

  const fruits: { value: string; label: string; keywords?: string[]; disabled?: boolean }[] = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry", keywords: ["red"] },
  ]

  const citrus: { value: string; label: string; keywords?: string[]; disabled?: boolean }[] = [
    { value: "lemon", label: "Lemon" },
    { value: "lime", label: "Lime" },
    { value: "orange", label: "Orange", disabled: true },
  ]
</script>



<Combobox>
  <div data-slot="stack">
    <ComboboxLabel>Fruit</ComboboxLabel>
    <div data-slot="row">
      <ComboboxInput placeholder="Search fruits" />
      <ComboboxTrigger aria-label="Show fruits">
        <ChevronDownIcon aria-hidden="true" />
      </ComboboxTrigger>
    </div>
  </div>
  <ComboboxContent>
    <ComboboxList>
      {#each fruits as fruit (fruit.value)}
        <ComboboxItem value={fruit.value} label={fruit.label} keywords={fruit.keywords} disabled={fruit.disabled}>
          {fruit.label}
          <ComboboxItemIndicator>
            <CheckIcon aria-hidden="true" />
          </ComboboxItemIndicator>
        </ComboboxItem>
      {/each}
      <ComboboxSeparator />
      <ComboboxGroup>
        <ComboboxGroupLabel>Citrus</ComboboxGroupLabel>
        {#each citrus as fruit (fruit.value)}
          <ComboboxItem
            value={fruit.value}
            label={fruit.label}
            keywords={fruit.keywords}
            disabled={fruit.disabled}
          >
            {fruit.label}
            <ComboboxItemIndicator>
              <CheckIcon aria-hidden="true" />
            </ComboboxItemIndicator>
          </ComboboxItem>
        {/each}
      </ComboboxGroup>
    </ComboboxList>
  </ComboboxContent>
</Combobox>
