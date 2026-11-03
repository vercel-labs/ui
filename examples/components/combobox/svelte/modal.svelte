<script lang="ts">
  import { CheckIcon, ChevronDownIcon } from "@lucide/svelte"
  import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxLabel,
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

  const modes = [
    { value: false, label: "Non-modal" },
    { value: "pointer", label: "Pointer" },
    { value: true, label: "Modal" },
  ] as const

  let modal: boolean | "pointer" = $state(false)
  let presses = $state(0)
</script>

<div data-slot="stack">
  <div role="group" aria-label="Modal" data-slot="row">
    {#each modes as mode (mode.label)}
      <button type="button" aria-pressed={modal === mode.value} onclick={() => (modal = mode.value)}>
        {mode.label}
      </button>
    {/each}
  </div>
  <Combobox {modal}>
    <div data-slot="stack">
      <ComboboxLabel>Framework</ComboboxLabel>
      <div data-slot="row">
        <ComboboxInput placeholder="Select a framework" />
        <ComboboxTrigger aria-label="Show frameworks">
          <ChevronDownIcon />
        </ComboboxTrigger>
      </div>
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
  <button type="button" onclick={() => presses++}>
    Pressed {presses} times
  </button>
</div>
