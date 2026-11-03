<script setup lang="ts">
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverClose,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/vue/popover"
</script>

<template>
  <Popover open-on-hover :delay="200" :close-delay="150">
    <PopoverTrigger>@ada</PopoverTrigger>
    <PopoverContent :side-offset="10">
      <PopoverArrow />
      <PopoverTitle>Ada Lovelace</PopoverTitle>
      <PopoverDescription> A collaborator on this project. </PopoverDescription>
      <PopoverClose>Close preview</PopoverClose>
    </PopoverContent>
  </Popover>
</template>
