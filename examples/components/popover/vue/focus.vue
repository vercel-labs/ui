<script setup lang="ts">
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/vue/popover"
</script>

<template>
  <div data-slot="row">
    <Popover>
      <PopoverTrigger>First field</PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>Rename</PopoverTitle>
        <label data-slot="label">
          Name
          <input value="Quarterly report" />
        </label>
      </PopoverContent>
    </Popover>
    <Popover>
      <PopoverTrigger>Specific element</PopoverTrigger>
      <PopoverContent initial-focus="[data-confirm]">
        <PopoverTitle>Apply changes?</PopoverTitle>
        <PopoverDescription>Focus starts on Apply, not Cancel.</PopoverDescription>
        <div data-slot="row">
          <PopoverClose>Cancel</PopoverClose>
          <PopoverClose data-confirm data-variant="solid">Apply</PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
    <Popover>
      <PopoverTrigger>No focus change</PopoverTrigger>
      <PopoverContent initial-focus="none" final-focus="none">
        <PopoverTitle>Status</PopoverTitle>
        <PopoverDescription>All systems are running.</PopoverDescription>
      </PopoverContent>
    </Popover>
  </div>
</template>
