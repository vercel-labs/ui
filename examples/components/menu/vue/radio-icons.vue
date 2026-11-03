<script setup lang="ts">
import { CheckIcon, CreditCardIcon, LandmarkIcon, WalletIcon } from "@lucide/vue"
import {
  Menu,
  MenuContent,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@ui-sdk/vue/menu"
import { computed, ref } from "vue"

const methods = [
  { value: "card", label: "Credit card", icon: CreditCardIcon },
  { value: "wallet", label: "Wallet", icon: WalletIcon },
  { value: "bank", label: "Bank transfer", icon: LandmarkIcon, disabled: true },
]

const method = ref("card")
const current = computed(() => methods.find((option) => option.value === method.value)!)
</script>

<template>
  <div data-slot="stack">
    <Menu>
      <MenuTrigger>
        <component :is="current.icon" />
        Payment method
      </MenuTrigger>
      <MenuContent>
        <MenuRadioGroup v-model:value="method">
          <MenuGroupLabel>Pay with</MenuGroupLabel>
          <MenuRadioItem
            v-for="option in methods"
            :key="option.value"
            :value="option.value"
            :disabled="option.disabled"
          >
            <component :is="option.icon" />
            {{ option.label }}
            <CheckIcon />
          </MenuRadioItem>
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
    <output data-slot="output">Paying with {{ current.label.toLowerCase() }}</output>
  </div>
</template>
