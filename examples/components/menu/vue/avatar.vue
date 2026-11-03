<script setup lang="ts">
import { CheckIcon, LogOutIcon, SettingsIcon, UserPlusIcon } from "@lucide/vue"
import {
  Menu,
  MenuContent,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/vue/menu"
import { computed, ref } from "vue"

const accounts = [
  { value: "personal", name: "Riley Park", initials: "RP" },
  { value: "studio", name: "North Studio", initials: "NS" },
]

const account = ref("personal")
const action = ref("")
const current = computed(() => accounts.find((option) => option.value === account.value)!)
</script>

<template>
  <div data-slot="stack">
    <Menu @action="(value: string) => (action = value)">
      <MenuTrigger aria-label="Account">
        {{ current.initials }}
      </MenuTrigger>
      <MenuContent align="end">
        <div data-slot="row">
          <span data-slot="badge">
            {{ current.initials }}
          </span>
          <div data-slot="stack">
            <div>{{ current.name }}</div>
            <div data-slot="hint">{{ current.value }}@example.com</div>
          </div>
        </div>
        <MenuSeparator />
        <MenuRadioGroup v-model:value="account">
          <MenuGroupLabel>Switch account</MenuGroupLabel>
          <MenuRadioItem v-for="option in accounts" :key="option.value" :value="option.value" close-on-select>
            <span data-slot="badge">
              {{ option.initials }}
            </span>
            {{ option.name }}
            <CheckIcon aria-hidden="true" />
          </MenuRadioItem>
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
    <output data-slot="output">{{ action ? `Ran ${action}` : `Signed in as ${current.name}` }}</output>
  </div>
</template>
