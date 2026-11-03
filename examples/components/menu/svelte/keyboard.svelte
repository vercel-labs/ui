<script lang="ts">
  import { Menu, MenuContent, MenuRadioGroup, MenuRadioItem, MenuTrigger } from "@ui-sdk/svelte/menu"

  const statuses = [
    { value: "online", label: "Online", hint: "Visible to everyone" },
    { value: "away", label: "Away", hint: "Shown as idle" },
    { value: "busy", label: "Do not disturb", hint: "Notifications are muted" },
    { value: "invisible", label: "Invisible", hint: "Appear offline" },
  ]

  let status = $state("online")
  const current = $derived(statuses.find((option) => option.value === status)!)
</script>

<div data-slot="stack">
  <Menu loop={false}>
    <MenuTrigger>{current.label}</MenuTrigger>
    <MenuContent>
      <MenuRadioGroup bind:value={status}>
        {#each statuses as option (option.value)}
          <MenuRadioItem value={option.value} label={option.label} closeOnSelect>
            <span data-slot="stack">
              {option.label}
              <span data-slot="hint">{option.hint}</span>
            </span>
          </MenuRadioItem>
        {/each}
      </MenuRadioGroup>
    </MenuContent>
  </Menu>
  <output data-slot="output">Arrow keys stop at the ends. Type a status to jump to it.</output>
</div>
