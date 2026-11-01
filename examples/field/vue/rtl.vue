<script setup lang="ts">
import { Check } from "@lucide/vue"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/vue/checkbox"
import { Field, FieldControl, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
</script>

<template>
  <div data-slot="stack" dir="rtl">
    <Field>
      <FieldLabel>الاسم على البطاقة</FieldLabel>
      <FieldControl name="card-name" autocomplete="cc-name" placeholder="ليلى حسن" />
    </Field>
    <Field>
      <FieldLabel>رقم البطاقة</FieldLabel>
      <FieldControl
        name="card-number"
        inputmode="numeric"
        autocomplete="cc-number"
        placeholder="1234 5678 9012 3456"
      />
      <FieldDescription>أدخل الرقم المكون من 16 خانة.</FieldDescription>
    </Field>
    <Field>
      <Checkbox name="save-card" default-checked>
        <CheckboxIndicator>
          <Check />
        </CheckboxIndicator>
      </Checkbox>
      <FieldLabel>احفظ البطاقة للمدفوعات القادمة</FieldLabel>
    </Field>
  </div>
</template>
