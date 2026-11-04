<script setup lang="ts">
import { Field, FieldControl, FieldLabel } from "@ui-sdk/vue/field"
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
  <Popover>
    <PopoverTrigger>Share</PopoverTrigger>
    <PopoverContent>
      <PopoverTitle>Share this document</PopoverTitle>
      <PopoverDescription>Anyone with the link can view it.</PopoverDescription>
      <Field>
        <FieldLabel>Link</FieldLabel>
        <FieldControl readonly default-value="acme.app/d/q3-roadmap" />
      </Field>
      <div data-slot="row">
        <PopoverClose>Cancel</PopoverClose>
        <PopoverClose data-variant="solid">Copy Link</PopoverClose>
      </div>
    </PopoverContent>
  </Popover>
</template>
