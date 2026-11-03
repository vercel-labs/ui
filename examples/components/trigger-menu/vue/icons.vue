<script setup lang="ts">
import { ClockIcon, ReplyIcon, SearchIcon, ShareIcon, TrashIcon } from "@lucide/vue"
import {
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuItemIcon,
  TriggerMenuList,
} from "@ui-sdk/vue/trigger-menu"

const commands = [
  { value: "reply", icon: ReplyIcon, mirror: true },
  { value: "remind", icon: ClockIcon },
  { value: "search", icon: SearchIcon },
  { value: "share", icon: ShareIcon },
  { value: "clear", icon: TrashIcon },
]
</script>

<template>
  <TriggerMenu :triggers="[{ char: '/', boundary: 'start', type: 'command' }]">
    <TriggerMenuInput aria-label="Message" placeholder="Type / for commands" />
    <TriggerMenuContent>
      <TriggerMenuList>
        <TriggerMenuItem v-for="command in commands" :key="command.value" :value="command.value"
          ><TriggerMenuItemIcon :mirror="command.mirror"><component :is="command.icon" /></TriggerMenuItemIcon
          >{{ command.value }}</TriggerMenuItem
        >
      </TriggerMenuList>
    </TriggerMenuContent>
  </TriggerMenu>
</template>
