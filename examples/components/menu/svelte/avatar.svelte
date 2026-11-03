<script lang="ts">
  import { CheckIcon, LogOutIcon, SettingsIcon, UserPlusIcon } from "@lucide/svelte"
  import {
    Menu,
    MenuContent,
    MenuGroupLabel,
    MenuItem,
    MenuRadioGroup,
    MenuRadioItem,
    MenuSeparator,
    MenuTrigger,
  } from "@ui-sdk/svelte/menu"

  const accounts = [
    { value: "personal", name: "Riley Park", initials: "RP" },
    { value: "studio", name: "North Studio", initials: "NS" },
  ]

  let account = $state("personal")
  let action = $state("")
  const current = $derived(accounts.find((option) => option.value === account)!)
</script>

<div data-slot="stack">
  <Menu onAction={(value: string) => (action = value)}>
    <MenuTrigger aria-label="Account">{current.initials}</MenuTrigger>
    <MenuContent align="end">
      <div data-slot="row">
        <span data-slot="badge">{current.initials}</span>
        <div data-slot="stack">
          <div>{current.name}</div>
          <div data-slot="hint">{current.value}@example.com</div>
        </div>
      </div>
      <MenuSeparator />
      <MenuRadioGroup bind:value={account}>
        <MenuGroupLabel>Switch account</MenuGroupLabel>
        {#each accounts as option (option.value)}
          <MenuRadioItem value={option.value} closeOnSelect>
            <span data-slot="badge">{option.initials}</span>
            {option.name}
            <CheckIcon aria-hidden="true" />
          </MenuRadioItem>
        {/each}
      </MenuRadioGroup>
      <MenuItem value="add-account">
        <UserPlusIcon aria-hidden="true" />
        Add account
      </MenuItem>
      <MenuSeparator />
      <MenuItem value="settings">
        <SettingsIcon aria-hidden="true" />
        Settings
      </MenuItem>
      <MenuItem value="sign-out">
        <LogOutIcon aria-hidden="true" />
        Sign out
      </MenuItem>
    </MenuContent>
  </Menu>
  <output data-slot="output">{action ? `Ran ${action}` : `Signed in as ${current.name}`}</output>
</div>
