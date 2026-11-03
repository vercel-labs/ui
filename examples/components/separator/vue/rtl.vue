<script setup lang="ts">
import { Separator } from "@ui-sdk/vue/separator"
</script>

<template>
  <div data-slot="stack" dir="rtl">
    <div data-slot="stack">
      <div>الحساب</div>
      <p data-slot="hint">إدارة ملفك الشخصي وتفضيلاتك.</p>
    </div>
    <Separator />
    <div data-slot="row">
      <div>الملف الشخصي</div>
      <Separator orientation="vertical" />
      <div>الفوترة</div>
      <Separator orientation="vertical" />
      <div>الإعدادات</div>
    </div>
  </div>
</template>
