<script lang="ts">
  import { CheckIcon, ChevronRightIcon, CircleHelpIcon, KeyboardIcon, LinkIcon, LogOutIcon, MailIcon, MessageCircleIcon, MonitorIcon, MoonIcon, PlusIcon, SettingsIcon, SunIcon, UserIcon, UserPlusIcon, UsersIcon } from "@lucide/svelte"
  import {
    Menu,
    MenuCheckboxItem,
    MenuContent,
    MenuGroup,
    MenuGroupLabel,
    MenuItem,
    MenuRadioGroup,
    MenuRadioItem,
    MenuSeparator,
    MenuSub,
    MenuSubContent,
    MenuSubTrigger,
    MenuTrigger,
  } from "@ui-sdk/svelte/menu"

  let action = $state("")
  let sidebar = $state(true)
  let theme = $state("system")
</script>

<div data-slot="stack">
  <Menu onAction={(value: string) => (action = value)}>
    <MenuTrigger>Workspace</MenuTrigger>
    <MenuContent>
      <MenuGroup>
        <MenuGroupLabel>My account</MenuGroupLabel>
        <MenuItem value="profile" shortcut="mod+shift+p">
          <UserIcon />
          Profile
        </MenuItem>
        <MenuItem value="settings" shortcut="mod+,">
          <SettingsIcon aria-hidden="true" />
          Settings
        </MenuItem>
        <MenuItem value="shortcuts" shortcut="mod+k">
          <KeyboardIcon />
          Keyboard shortcuts
        </MenuItem>
      </MenuGroup>
      <MenuSeparator />
      <MenuGroup>
        <MenuItem value="team">
          <UsersIcon />
          Team
        </MenuItem>
        <MenuSub>
          <MenuSubTrigger>
            <UserPlusIcon aria-hidden="true" />
            Invite people
            <ChevronRightIcon aria-hidden="true" />
          </MenuSubTrigger>
          <MenuSubContent>
            <MenuItem value="invite-email">
              <MailIcon />
              Email
            </MenuItem>
            <MenuItem value="invite-message">
              <MessageCircleIcon />
              Message
            </MenuItem>
            <MenuSeparator />
            <MenuItem value="invite-link">
              <LinkIcon />
              Copy invite link
            </MenuItem>
          </MenuSubContent>
        </MenuSub>
        <MenuItem value="new-team" shortcut="mod+t">
          <PlusIcon />
          New team
        </MenuItem>
      </MenuGroup>
      <MenuSeparator />
      <MenuCheckboxItem bind:checked={sidebar} value="sidebar">
        <MonitorIcon />
        Show sidebar
        <CheckIcon aria-hidden="true" />
      </MenuCheckboxItem>
      <MenuSub>
        <MenuSubTrigger>
          {#if theme === "dark"}
            <MoonIcon />
          {:else}
            <SunIcon />
          {/if}
          Theme
          <ChevronRightIcon aria-hidden="true" />
        </MenuSubTrigger>
        <MenuSubContent>
          <MenuRadioGroup bind:value={theme}>
            <MenuRadioItem value="light">
              <SunIcon />
              Light
              <CheckIcon aria-hidden="true" />
            </MenuRadioItem>
            <MenuRadioItem value="dark">
              <MoonIcon />
              Dark
              <CheckIcon aria-hidden="true" />
            </MenuRadioItem>
            <MenuRadioItem value="system">
              <MonitorIcon />
              System
              <CheckIcon aria-hidden="true" />
            </MenuRadioItem>
          </MenuRadioGroup>
        </MenuSubContent>
      </MenuSub>
      <MenuSeparator />
      <MenuItem value="help">
        <CircleHelpIcon />
        Help
      </MenuItem>
      <MenuItem value="sign-out" shortcut="mod+shift+q">
        <LogOutIcon aria-hidden="true" />
        Sign out
      </MenuItem>
    </MenuContent>
  </Menu>
  <output data-slot="output">
    {action ? `Ran ${action}` : `Sidebar ${sidebar ? "shown" : "hidden"}, ${theme} theme`}
  </output>
</div>
