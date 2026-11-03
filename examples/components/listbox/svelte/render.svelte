<script lang="ts">
  import { ExternalLinkIcon } from "@lucide/svelte"
  import { Listbox, ListboxItem } from "@ui-sdk/svelte/listbox"

  const frameworks = [
    { value: "next", label: "Next.js" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
    { value: "nuxt", label: "Nuxt" },
    { value: "sveltekit", label: "SvelteKit" },
  ]
</script>

<Listbox defaultValue="next" activation="manual" aria-label="Framework docs">
  {#each frameworks as framework (framework.value)}
    <ListboxItem href={`#${framework.value}`} value={framework.value} label={framework.label}>
      {#snippet render({ props, state })}
        <a {...props}>
          <span>{framework.label}</span>
          {#if state.selected}
            <ExternalLinkIcon aria-hidden="true" />
          {/if}
        </a>
      {/snippet}
    </ListboxItem>
  {/each}
</Listbox>
