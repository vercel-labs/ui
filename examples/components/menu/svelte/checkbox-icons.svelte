<script lang="ts">
  import { BellIcon, CheckIcon, MailIcon, SmartphoneIcon } from "@lucide/svelte"
  import {
    Menu,
    MenuCheckboxItem,
    MenuContent,
    MenuGroup,
    MenuGroupLabel,
    MenuTrigger,
  } from "@ui-sdk/svelte/menu"

  const channels = [
    { value: "email", label: "Email", icon: MailIcon },
    { value: "sms", label: "Text message", icon: SmartphoneIcon },
    { value: "push", label: "Push", icon: BellIcon },
  ]

  let enabled = $state(["email", "push"])

  function toggle(value: string, checked: boolean) {
    enabled = checked ? [...enabled, value] : enabled.filter((current) => current !== value)
  }
</script>

<div data-slot="stack">
  <Menu>
    <MenuTrigger>
      <BellIcon />
      Notifications
    </MenuTrigger>
    <MenuContent>
      <MenuGroup>
        <MenuGroupLabel>Notify me by</MenuGroupLabel>
        {#each channels as channel (channel.value)}
          <MenuCheckboxItem
            value={channel.value}
            bind:checked={() => enabled.includes(channel.value), (checked) => toggle(channel.value, checked)}
          >
            {#snippet children(state)}
              <channel.icon />
              {channel.label}
              {#if state.checked}
                <CheckIcon />
              {/if}
            {/snippet}
          </MenuCheckboxItem>
        {/each}
      </MenuGroup>
    </MenuContent>
  </Menu>
  <output data-slot="output">{enabled.length ? `On: ${enabled.join(", ")}` : "All notifications off"}</output>
</div>
