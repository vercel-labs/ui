<script setup lang="ts">
import { SearchIcon, XIcon } from "@lucide/vue"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
import { Input, InputClear, InputGroup } from "@ui-sdk/vue/input"
</script>

<template>
  <div data-slot="stack" dir="rtl">
    <Field name="name">
      <FieldLabel> الاسم الكامل </FieldLabel>
      <Input placeholder="ليلى حسن" />
      <FieldDescription>كما يظهر في ملفك الشخصي.</FieldDescription>
    </Field>
    <InputGroup>
      <SearchIcon />
      <Input type="search" aria-label="بحث" default-value="حسن" />
      <InputClear aria-label="مسح البحث">
        <XIcon />
      </InputClear>
    </InputGroup>
  </div>
</template>
