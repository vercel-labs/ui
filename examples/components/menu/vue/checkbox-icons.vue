<script setup lang="ts">
import { BellIcon, CheckIcon, MailIcon, SmartphoneIcon } from "@lucide/vue"
import { Menu, MenuCheckboxItem, MenuContent, MenuGroup, MenuGroupLabel, MenuTrigger } from "@ui-sdk/vue/menu"
import { ref } from "vue"

const channels = [
  { value: "email", label: "Email", icon: MailIcon },
  { value: "sms", label: "Text message", icon: SmartphoneIcon },
  { value: "push", label: "Push", icon: BellIcon },
]

const enabled = ref(["email", "push"])

function toggle(value: string, checked: boolean) {
  enabled.value = checked ? [...enabled.value, value] : enabled.value.filter((current) => current !== value)
}
</script>

<template>
  <div data-slot="stack">
    <Menu>
      <MenuTrigger>
        <BellIcon />
        Notifications
      </MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuGroupLabel>Notify me by</MenuGroupLabel>
          <MenuCheckboxItem
            v-for="channel in channels"
            :key="channel.value"
            v-slot="{ state }"
            :value="channel.value"
            :checked="enabled.includes(channel.value)"
            @update:checked="(checked: boolean) => toggle(channel.value, checked)"
          >
            <component :is="channel.icon" />
            {{ channel.label }}
            <CheckIcon v-if="state.checked" />
          </MenuCheckboxItem>
        </MenuGroup>
      </MenuContent>
    </Menu>
    <output data-slot="output">{{
      enabled.length ? `On: ${enabled.join(", ")}` : "All notifications off"
    }}</output>
  </div>
</template>
