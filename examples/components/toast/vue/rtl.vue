<script setup lang="ts">
import {
  Toast,
  ToastDescription,
  ToastRegion,
  ToastTitle,
  createToaster,
} from "@ui-sdk/vue/toast"

const toast = createToaster()
</script>

<template>
  <div dir="rtl">
    <button
      @click="
        toast('تم إنشاء الحدث', {
          description: 'الأحد 3 ديسمبر الساعة 9:00 صباحًا',
        })
      "
    >
      إظهار الإشعار
    </button>
    <ToastRegion :toaster="toast">
      <template #default="{ toast: item }">
        <Toast>
          <div data-slot="stack">
            <ToastTitle />
            <ToastDescription />
          </div>
        </Toast>
      </template>
    </ToastRegion>
  </div>
</template>
