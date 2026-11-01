<script setup lang="ts">
import { Check } from "@lucide/vue"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/vue/checkbox"
</script>

<template>
  <div data-slot="stack" dir="rtl">
    <label data-slot="label">
      <Checkbox>
        <CheckboxIndicator>
          <Check />
        </CheckboxIndicator>
      </Checkbox>
      قبول الشروط والأحكام
    </label>
    <label data-slot="label">
      <Checkbox default-checked>
        <CheckboxIndicator>
          <Check />
        </CheckboxIndicator>
      </Checkbox>
      تفعيل الإشعارات
    </label>
  </div>
</template>
