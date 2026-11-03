<script lang="ts">
  import { CheckIcon, ChevronDownIcon } from "@lucide/svelte"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@ui-sdk/svelte/select"

  const languages = [
    { value: "ar", label: "العربية" },
    { value: "en", label: "الإنجليزية" },
    { value: "fr", label: "الفرنسية" },
    { value: "es", label: "الإسبانية" },
    { value: "de", label: "الألمانية" },
  ]

</script>

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
      {#each languages as language (language.value)}
        <SelectItem value={language.value}>
          {language.label}
          <SelectItemIndicator>
            <CheckIcon />
          </SelectItemIndicator>
        </SelectItem>
      {/each}
    </SelectContent>
  </Select>
</div>
