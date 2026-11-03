<script lang="ts">
  import { CheckIcon } from "@lucide/svelte"
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"
  import { Listbox, ListboxItem, ListboxItemIndicator } from "@ui-sdk/svelte/listbox"

  const frameworks = [
    { value: "next", label: "Next.js" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
    { value: "nuxt", label: "Nuxt" },
    { value: "sveltekit", label: "SvelteKit" },
  ]
</script>

<Field>
  <FieldLabel>Framework</FieldLabel>
  <Listbox defaultValue="next">
    {#each frameworks as framework (framework.value)}
      <ListboxItem value={framework.value}>
        {framework.label}
        <ListboxItemIndicator>
          <CheckIcon aria-hidden="true" />
        </ListboxItemIndicator>
      </ListboxItem>
    {/each}
  </Listbox>
</Field>
