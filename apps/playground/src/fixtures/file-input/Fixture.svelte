<script lang="ts">
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
  } from "@ui-sdk/svelte"
  import {
    describeChange,
    fileInputFixture as f,
    fileInputOptions,
    serializeFiles,
  } from "tests/fixtures/file-input.ts"

  const options = fileInputOptions()
  let action = $state("")
  let count = $state(0)
  let submitted = $state("")
  let attachments = $state<File[]>([])
  let note = $state<HTMLTextAreaElement | null>(null)

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
      action = describeChange(kind, details)
      count++
      const ignored =
        options.ignoreRemovals && details.reason === "remove-press"
      if (kind === "attachments" && !details.canceled && !ignored) {
        attachments = value
      }
    }
  }
  function onReject(kind: string) {
    return (rejected: FileRejection[], details: { reason: string }) => {
      if (!changed) {
        action = describeChange(kind, { ...details, rejected })
      }
    }
  }

  // A controlled owner decides: `onChange` keeps `attachments` as its own
  // state, so the binding's setter ignores the file input's writes.
  const ignore = () => {}

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    submitted = serializeFiles(event.currentTarget as HTMLFormElement)
  }
</script>

<div class="fixture">
  <button>Before</button>
  <form class="form" id={f.formId} aria-label={f.formLabel} onsubmit={onSubmit}>
    <Field>
      <FieldLabel>{f.field.label}</FieldLabel>
      <FileInput
        class="file-input"
        name={options.name}
        accept={f.attachments.accept}
        multiple={options.multiple}
        maxFiles={options.maxFiles}
        maxSize={f.attachments.maxSize}
        minSize={f.attachments.minSize}
        required={options.required}
        disabled={options.disabled}
        bind:value={
          () => (options.controlled ? attachments : undefined), ignore
        }
        onValueChange={onChange("attachments")}
        onReject={onReject("attachments")}
      >
        <FileInputDropzone
          class="zone"
          role="group"
          aria-label={f.zone.label}
          pasteTarget={() => note}
        >
          {#snippet children(state)}
            <p>{state.dragging ? f.zone.dragging : f.zone.text}</p>
            <FileInputTrigger>{f.trigger.label}</FileInputTrigger>
          {/snippet}
        </FileInputDropzone>
        <FileInputList aria-label={f.list.label} class="file-list">
          <FileInputItem class="file-item">
            {#snippet children(state)}
              <span>{state.file.name}</span>
              <FileInputItemRemove>×</FileInputItemRemove>
            {/snippet}
          </FileInputItem>
        </FileInputList>
      </FileInput>
      <FieldDescription>{f.field.description}</FieldDescription>
      <FieldError class="field-error" match="valueMissing"
        >{f.field.error}</FieldError
      >
    </Field>
    <label>
      {f.note.label}
      <textarea bind:this={note} name={f.note.name}></textarea>
    </label>
    <div class="row">
      <button type="submit">Send</button>
      <button type="reset">Reset</button>
    </div>
  </form>
  <FileInput
    accept={f.avatar.accept}
    capture={f.avatar.capture}
    onValueChange={onChange("avatar")}
    onReject={onReject("avatar")}
  >
    <FileInputTrigger>{f.avatar.label}</FileInputTrigger>
  </FileInput>
  <FileInput
    directory
    onValueChange={onChange("folder")}
    onReject={onReject("folder")}
  >
    <FileInputTrigger>{f.folder.label}</FileInputTrigger>
  </FileInput>
  {#if options.page}
    <FileInput
      multiple
      onValueChange={onChange("page")}
      onReject={onReject("page")}
    >
      <FileInputDropzone
        class="page-zone"
        role="group"
        aria-label={f.page.label}
        target="document"
      >
        {f.page.text}
      </FileInputDropzone>
    </FileInput>
  {/if}
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output role="status" aria-label="Actions">{count}</output>
  <output role="status" aria-label="Submitted">{submitted}</output>
</div>
