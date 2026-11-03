<script setup lang="ts">
import { Progress, ProgressIndicator, ProgressLabel, ProgressTrack } from "@ui-sdk/vue/progress"
</script>

<template>
  <Progress :value="null">
    <ProgressLabel>Connecting</ProgressLabel>
    <ProgressTrack>
      <ProgressIndicator />
    </ProgressTrack>
  </Progress>
</template>
