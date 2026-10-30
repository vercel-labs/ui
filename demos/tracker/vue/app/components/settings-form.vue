<script setup lang="ts">
import { Info } from "@lucide/vue"
import type { Settings } from "tracker-data"
import { ref } from "vue"
import { Button, buttonVariants } from "~/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "~/components/ui/field"
import { NumberInput } from "~/components/ui/number-input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Slider } from "~/components/ui/slider"
import { Switch } from "~/components/ui/switch"
import { toast } from "~/components/ui/toast"
import { saveSettings } from "~/composables/settings"

defineProps<{ settings: Settings }>()

const pending = ref(false)

async function submit(event: SubmitEvent) {
  pending.value = true
  try {
    await saveSettings(new FormData(event.currentTarget as HTMLFormElement))
    toast.success("Settings saved")
  } catch {
    toast.error("Couldn't save your settings. Try again.")
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <form class="grid gap-8" @submit.prevent="submit">
    <Field class="flex-row items-center justify-between gap-6">
      <div class="grid gap-1.5">
        <FieldLabel>Email notifications</FieldLabel>
        <FieldDescription>Get an email when someone mentions you or assigns you an issue.</FieldDescription>
      </div>
      <Switch name="emailNotifications" :default-checked="settings.emailNotifications" />
    </Field>
    <Field>
      <FieldLabel>Issues per page</FieldLabel>
      <NumberInput name="pageSize" :default-value="settings.pageSize" :min="5" :max="50" :step="5" />
      <FieldDescription>How many issues the list shows before it splits into pages.</FieldDescription>
    </Field>
    <Field>
      <Slider
        name="autoCloseDays"
        :default-value="settings.autoCloseDays"
        :min="7"
        :max="90"
        :step="1"
        :format="{ style: 'unit', unit: 'day', unitDisplay: 'long' }"
      >
        <template #label>
          <span class="flex items-center gap-1">
            <FieldLabel>Close stale issues after</FieldLabel>
            <Popover>
              <PopoverTrigger
                aria-label="About stale issues"
                :class="buttonVariants({ variant: 'ghost', size: 'icon-sm' })"
              >
                <Info aria-hidden="true" />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverTitle class="font-medium">Stale issues</PopoverTitle>
                <PopoverDescription class="text-muted-foreground">
                  An open issue with no comments or changes for this long moves to Canceled. Its assignee gets
                  an email first.
                </PopoverDescription>
              </PopoverContent>
            </Popover>
          </span>
        </template>
      </Slider>
    </Field>
    <div class="flex justify-end">
      <Button type="submit" variant="primary" :disabled="pending">
        {{ pending ? "Saving…" : "Save changes" }}
      </Button>
    </div>
  </form>
</template>
