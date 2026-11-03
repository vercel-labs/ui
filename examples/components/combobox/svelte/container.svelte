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

  const frameworks = [
    { value: "next", label: "Next.js" },
    { value: "sveltekit", label: "SvelteKit" },
    { value: "nuxt", label: "Nuxt" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
    { value: "solidstart", label: "SolidStart" },
    { value: "qwik", label: "Qwik City" },
  ]

  let container: HTMLDivElement | undefined = $state()
</script>

<div data-slot="stack">
  <Combobox {container}>
    <div data-slot="row">
      <ComboboxInput aria-label="Framework" placeholder="Select a framework" />
      <ComboboxTrigger aria-label="Show frameworks">
        <ChevronDownIcon />
      </ComboboxTrigger>
    </div>
    <ComboboxContent>
      <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
      <ComboboxList>
        {#each frameworks as framework (framework.value)}
          <ComboboxItem value={framework.value} label={framework.label}>
            {framework.label}
            <ComboboxItemIndicator>
              <CheckIcon />
            </ComboboxItemIndicator>
          </ComboboxItem>
        {/each}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
  <div data-slot="card">
    Container
    <div bind:this={container}></div>
  </div>
</div>
