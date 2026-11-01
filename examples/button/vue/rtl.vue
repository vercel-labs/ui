<script setup lang="ts">
import { ChevronRight } from "@lucide/vue"
import { Button } from "@ui-sdk/vue/button"
</script>

<template>
  <div data-slot="row" dir="rtl">
    <Button>
      متابعة
      <ChevronRight />
    </Button>
    <Button>إلغاء</Button>
  </div>
</template>
