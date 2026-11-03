<script lang="ts">
  import { CornerDownLeftIcon } from "@lucide/svelte"
  import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/svelte/menu"

  const sections = [
    { href: "#composition", label: "Composition" },
    { href: "#styling", label: "Styling" },
    { href: "#api-reference", label: "API reference" },
  ]
</script>

<Menu>
  <MenuTrigger>Links</MenuTrigger>
  <MenuContent>
    {#each sections as section (section.href)}
      <MenuItem href={section.href}>
        {#snippet render({ props })}
          <a {...props}>
            {section.label}
            <CornerDownLeftIcon aria-hidden="true" />
          </a>
        {/snippet}
      </MenuItem>
    {/each}
  </MenuContent>
</Menu>
