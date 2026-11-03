<script lang="ts">
  import { CheckIcon } from "@lucide/svelte"
  import {
    Combobox,
    ComboboxArrow,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxList,
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

  const sides = ["top", "right", "bottom", "left"] as const
  const aligns = ["start", "center", "end"] as const

  let side: (typeof sides)[number] = $state("bottom")
  let align: (typeof aligns)[number] = $state("start")
  let box: HTMLDivElement | undefined = $state()
  let anchored = $state(false)
</script>

<div data-slot="stack">
  <div data-slot="stack">
    <div role="group" aria-label="Side" data-slot="row">
      {#each sides as value (value)}
        <button type="button" aria-pressed={side === value} onclick={() => (side = value)}>
          {value}
        </button>
      {/each}
    </div>
    <div role="group" aria-label="Align" data-slot="row">
      {#each aligns as value (value)}
        <button type="button" aria-pressed={align === value} onclick={() => (align = value)}>
          {value}
        </button>
      {/each}
    </div>
    <label data-slot="label">
      <input bind:checked={anchored} type="checkbox" />
      Anchor to the box
    </label>
  </div>
  <div bind:this={box} data-slot="card">
    <Combobox>
      <ComboboxInput aria-label="Framework" placeholder="Framework" />
      <ComboboxContent
        {side}
        {align}
        sideOffset={10}
        alignOffset={0}
        collisionPadding={16}
        anchor={anchored ? box : null}
      >
        <ComboboxArrow />
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
  </div>
</div>
