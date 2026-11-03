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
</script>

<Select defaultValue="fr">
  <div data-slot="stack">
    <SelectLabel>Country</SelectLabel>
    <SelectTrigger>
      <SelectValue />
      <ChevronDownIcon />
    </SelectTrigger>
    <p data-slot="hint">Focus it and type “sw” or “g”.</p>
  </div>
  <SelectContent>
    {#each countries as country (country.value)}
      <SelectItem value={country.value} label={country.label}>
        {country.label}
        <span data-slot="hint">{country.code}</span>
        <SelectItemIndicator>
          <CheckIcon />
        </SelectItemIndicator>
      </SelectItem>
    {/each}
  </SelectContent>
</Select>
