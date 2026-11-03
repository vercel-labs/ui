<script setup lang="ts">
import { MoveHorizontalIcon, MoveVerticalIcon } from "@lucide/vue"
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import {
  NumberInput,
  NumberInputGroup,
  NumberInputControl,
  NumberInputScrubArea,
  NumberInputScrubAreaCursor,
} from "@ui-sdk/vue/number-input"
</script>

<template>
  <div data-slot="row">
    <Field>
      <NumberInput :default-value="320" :min="0">
        <NumberInputScrubArea :pixels-per-step="2">
          <FieldLabel>Width</FieldLabel>
          <NumberInputScrubAreaCursor>
            <MoveHorizontalIcon aria-hidden="true" />
          </NumberInputScrubAreaCursor>
        </NumberInputScrubArea>
        <NumberInputGroup>
          <NumberInputControl />
        </NumberInputGroup>
      </NumberInput>
    </Field>
    <Field>
      <NumberInput :default-value="240" :min="0">
        <NumberInputScrubArea orientation="vertical" :pixels-per-step="2">
          <FieldLabel>Height</FieldLabel>
          <NumberInputScrubAreaCursor>
            <MoveVerticalIcon aria-hidden="true" />
          </NumberInputScrubAreaCursor>
        </NumberInputScrubArea>
        <NumberInputGroup>
          <NumberInputControl />
        </NumberInputGroup>
      </NumberInput>
    </Field>
  </div>
</template>
