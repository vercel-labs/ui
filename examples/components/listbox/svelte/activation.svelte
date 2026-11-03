<script lang="ts">
  import { FileIcon } from "@lucide/svelte"
  import { Listbox, ListboxItem, ListboxItemIcon } from "@ui-sdk/svelte/listbox"

  const files = [
    { value: "readme", label: "README.md" },
    { value: "package", label: "package.json" },
    { value: "tsconfig", label: "tsconfig.json" },
    { value: "index", label: "index.ts" },
    { value: "styles", label: "styles.css" },
    { value: "logo", label: "logo.svg" },
  ]

  let value = $state<string[]>(["readme"])
</script>

<div data-slot="stack">
  <Listbox bind:value multiple activation="automatic" aria-label="Files">
    {#each files as file (file.value)}
      <ListboxItem value={file.value}>
        <ListboxItemIcon>
          <FileIcon aria-hidden="true" />
        </ListboxItemIcon>
        {file.label}
      </ListboxItem>
    {/each}
  </Listbox>
  <output data-slot="output">{value.length} selected</output>
</div>
