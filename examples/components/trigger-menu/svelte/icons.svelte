<script lang="ts">
  import { ClockIcon, ReplyIcon, SearchIcon, ShareIcon, TrashIcon } from "@lucide/svelte"
  import {
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuInput,
    TriggerMenuItem,
    TriggerMenuItemIcon,
    TriggerMenuList,
  } from "@ui-sdk/svelte/trigger-menu"

  const commands = [
    { value: "reply", icon: ReplyIcon, mirror: true },
    { value: "remind", icon: ClockIcon },
    { value: "search", icon: SearchIcon },
    { value: "share", icon: ShareIcon },
    { value: "clear", icon: TrashIcon },
  ]
</script>

<TriggerMenu triggers={[{ char: "/", boundary: "start", type: "command" }]}>
  <TriggerMenuInput aria-label="Message" placeholder="Type / for commands" />
  <TriggerMenuContent>
    <TriggerMenuList>
      {#each commands as command (command.value)}
        <TriggerMenuItem value={command.value}>
          <TriggerMenuItemIcon mirror={command.mirror}><command.icon /></TriggerMenuItemIcon>
          {command.value}
        </TriggerMenuItem>
      {/each}
    </TriggerMenuList>
  </TriggerMenuContent>
</TriggerMenu>
