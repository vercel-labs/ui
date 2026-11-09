<script setup lang="ts">
import type { ChangeDetails } from "@ui-sdk/core"
import {
  Button,
  Separator,
  Toggle,
  ToggleGroup,
  createToggleGroupController,
  type ButtonActionDetails,
} from "@ui-sdk/vue"
import { changedValue, toggleOptions } from "tests/fixtures/page.ts"
import { toggleAction, toggleFixture } from "tests/fixtures/toggle.ts"
import { ref } from "vue"

const { cancel, defaultPressed, disabled, alignment, ...groupOptions } =
  toggleOptions()
const formatting = createToggleGroupController()
const action = ref("")
const pressedWith = ref("")
const submissions = ref(0)

// Each group's value, to tell which toggle a change touches.
const values: Record<string, string[]> = {
  alignment: alignment ? [alignment] : toggleFixture.alignment.defaultValue,
  formatting: toggleFixture.formatting.defaultValue,
}
const groups = [
  {
    ...toggleFixture.alignment,
    multiple: false,
    disabled: false,
    controller: undefined,
  },
  {
    ...toggleFixture.formatting,
    multiple: true,
    disabled,
    controller: formatting,
  },
]

function onValueChange(
  name: string,
  value: string[],
  details: { cancel: () => void }
) {
  if (cancel && changedValue(values[name], value) === cancel) {
    return details.cancel()
  }
  values[name] = value
  action.value = toggleAction.group(name, value)
}

function onPressedChange(pressed: boolean, details: ChangeDetails) {
  if (cancel === toggleFixture.toggle.value) {
    return details.cancel()
  }
  action.value = toggleAction.toggle(pressed)
}

// A Promise and the buttons that settle it.
function gate() {
  let settle:
    { resolve: () => void; reject: (reason: Error) => void } | undefined
  return {
    wait: () =>
      new Promise<void>((resolve, reject) => (settle = { resolve, reject })),
    resolve: () => settle?.resolve(),
    reject: () => settle?.reject(new Error("Offline")),
  }
}
const saving = gate()
const publishing = gate()

function save(_event: MouseEvent, { source }: ButtonActionDetails) {
  action.value = "save"
  pressedWith.value = source
}

async function publish() {
  action.value = "publishing"
  await publishing.wait()
  action.value = "published"
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Toggle
      class="toggle"
      :default-pressed="defaultPressed"
      @pressed-change="onPressedChange"
    >
      {{ toggleFixture.toggle.label }}
    </Toggle>
    <template v-for="(group, index) in groups" :key="group.name">
      <Separator v-if="index === 1" class="rule" orientation="vertical" />
      <ToggleGroup
        class="toggle-group"
        :aria-label="group.label"
        :default-value="values[group.name]"
        :multiple="group.multiple"
        :disabled="group.disabled"
        :controller="group.controller"
        v-bind="groupOptions"
        @value-change="
          (value, details) => onValueChange(group.name, value, details)
        "
      >
        <Toggle
          v-for="item in group.items"
          :key="item.value"
          class="toggle"
          :value="item.value"
          :disabled="item.disabled"
        >
          {{ item.label }}
        </Toggle>
      </ToggleGroup>
    </template>
    <form
      :aria-label="toggleFixture.form.label"
      @submit.prevent="submissions++"
    >
      <label>
        {{ toggleFixture.form.field }}
        <input name="name" :defaultValue="toggleFixture.form.defaultName" />
      </label>
      <Button class="button" type="submit" @click="saving.wait">Submit</Button>
      <Button class="button" type="reset">Reset</Button>
      <Button class="button" disabled @click="action = 'delete'">Delete</Button>
      <Button
        class="button"
        type="submit"
        disabled
        focusable-when-disabled
        @click="action = 'archive'"
      >
        Archive
      </Button>
    </form>
    <Button class="button" @click="save">Save</Button>
    <Button class="button" @click="publish">Publish</Button>
    <button @click="formatting.setValue([])">Clear formatting</button>
    <button @click="saving.resolve">Finish saving</button>
    <button @click="publishing.resolve">Finish publishing</button>
    <button @click="publishing.reject">Fail publishing</button>
    <Button class="button" :href="toggleFixture.docs.href">
      <template #render="{ props }">
        <a v-bind="props">{{ toggleFixture.docs.label }}</a>
      </template>
    </Button>
    <Button class="button" :href="toggleFixture.changelog.href" disabled>
      <template #render="{ props }">
        <a v-bind="props">{{ toggleFixture.changelog.label }}</a>
      </template>
    </Button>
    <Separator class="rule" />
    <Separator class="rule" decorative />
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output aria-label="Submissions">{{ submissions }}</output>
    <output aria-label="Pressed with">{{ pressedWith }}</output>
  </div>
</template>
