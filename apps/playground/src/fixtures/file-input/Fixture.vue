<script setup lang="ts">
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
  type FileInputValueChangeDetails,
  type FileRejection,
} from "@ui-sdk/vue"
import { ref } from "vue"
import {
  describeChange,
  fileInputFixture as f,
  fileInputOptions,
  serializeFiles,
} from "tests/fixtures/file-input.ts"

const options = fileInputOptions()
const action = ref("")
const count = ref(0)
const submitted = ref("")
const attachments = ref<File[]>([])
const note = ref<HTMLTextAreaElement | null>(null)

// A change counts as an action, and shows its rejections too. Rejections
// without a change only show. Both callbacks run in the same task.
let changed = false
function onChange(kind: string) {
  return (value: File[], details: FileInputValueChangeDetails) => {
    if (options.cancel) {
      details.cancel()
    }
    changed = true
    queueMicrotask(() => (changed = false))
    action.value = describeChange(kind, details)
    count.value++
    const ignored = options.ignoreRemovals && details.reason === "remove-press"
    if (kind === "attachments" && !details.canceled && !ignored) {
      attachments.value = value
    }
  }
}
function onReject(kind: string) {
  return (rejected: FileRejection[], details: { reason: string }) => {
    if (!changed) {
      action.value = describeChange(kind, { ...details, rejected })
    }
  }
}
const attachmentsChange = onChange("attachments")
const attachmentsReject = onReject("attachments")
const avatarChange = onChange("avatar")
const avatarReject = onReject("avatar")
const folderChange = onChange("folder")
const folderReject = onReject("folder")
const pageChange = onChange("page")
const pageReject = onReject("page")

function onSubmit(event: Event) {
  submitted.value = serializeFiles(event.currentTarget as HTMLFormElement)
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <form
      class="form"
      :id="f.formId"
      :aria-label="f.formLabel"
      @submit.prevent="onSubmit"
    >
      <Field>
        <FieldLabel>{{ f.field.label }}</FieldLabel>
        <FileInput
          class="file-input"
          :name="options.name"
          :accept="f.attachments.accept"
          :multiple="options.multiple"
          :max-files="options.maxFiles"
          :max-size="f.attachments.maxSize"
          :min-size="f.attachments.minSize"
          :required="options.required"
          :disabled="options.disabled"
          :value="options.controlled ? attachments : undefined"
          @value-change="attachmentsChange"
          @reject="attachmentsReject"
        >
          <FileInputDropzone
            class="zone"
            role="group"
            :aria-label="f.zone.label"
            :paste-target="() => note"
            v-slot="{ state }"
          >
            <p>{{ state.dragging ? f.zone.dragging : f.zone.text }}</p>
            <FileInputTrigger>{{ f.trigger.label }}</FileInputTrigger>
          </FileInputDropzone>
          <FileInputList :aria-label="f.list.label" class="file-list">
            <FileInputItem class="file-item" v-slot="{ state }">
              <span>{{ state.file.name }}</span>
              <FileInputItemRemove>×</FileInputItemRemove>
            </FileInputItem>
          </FileInputList>
        </FileInput>
        <FieldDescription>{{ f.field.description }}</FieldDescription>
        <FieldError class="field-error" match="valueMissing">{{
          f.field.error
        }}</FieldError>
      </Field>
      <label>
        {{ f.note.label }}
        <textarea ref="note" :name="f.note.name"></textarea>
      </label>
      <div class="row">
        <button type="submit">Send</button>
        <button type="reset">Reset</button>
      </div>
    </form>
    <FileInput
      :accept="f.avatar.accept"
      :capture="f.avatar.capture"
      @value-change="avatarChange"
      @reject="avatarReject"
    >
      <FileInputTrigger>{{ f.avatar.label }}</FileInputTrigger>
    </FileInput>
    <FileInput directory @value-change="folderChange" @reject="folderReject">
      <FileInputTrigger>{{ f.folder.label }}</FileInputTrigger>
    </FileInput>
    <FileInput
      v-if="options.page"
      multiple
      @value-change="pageChange"
      @reject="pageReject"
    >
      <FileInputDropzone
        class="page-zone"
        role="group"
        :aria-label="f.page.label"
        target="document"
      >
        {{ f.page.text }}
      </FileInputDropzone>
    </FileInput>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output role="status" aria-label="Actions">{{ count }}</output>
    <output role="status" aria-label="Submitted">{{ submitted }}</output>
  </div>
</template>
