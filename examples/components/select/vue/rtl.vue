<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/vue/select"
import { CheckIcon, ChevronDownIcon } from "@lucide/vue"

const languages = [
  { value: "ar", label: "العربية" },
  { value: "en", label: "الإنجليزية" },
  { value: "fr", label: "الفرنسية" },
  { value: "es", label: "الإسبانية" },
  { value: "de", label: "الألمانية" },
]
</script>

<template>
  <div dir="rtl">
    <Select placeholder="اختر لغة">
      <div data-slot="stack">
        <SelectLabel>اللغة</SelectLabel>
        <SelectTrigger>
          <SelectValue />
          <ChevronDownIcon />
        </SelectTrigger>
      </div>
      <SelectContent>
        <SelectItem v-for="language in languages" :key="language.value" :value="language.value">
          {{ language.label }}
          <SelectItemIndicator>
            <CheckIcon />
          </SelectItemIndicator>
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
