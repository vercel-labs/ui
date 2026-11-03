<script setup lang="ts">
import { HoverCard, HoverCardArrow, HoverCardContent, HoverCardTrigger } from "@ui-sdk/vue/hover-card"
</script>

<template>
  <div dir="rtl">
    <HoverCard>
      <HoverCardTrigger href="https://example.com/people/ada">آدا لوفليس</HoverCardTrigger>
      <HoverCardContent align="start" :side-offset="10">
        <HoverCardArrow />
        <p>آدا لوفليس</p>
        <p>كتبت أول برنامج منشور للمحرك التحليلي.</p>
      </HoverCardContent>
    </HoverCard>
  </div>
</template>
