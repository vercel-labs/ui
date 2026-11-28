import {
  computed,
  Directive,
  inject,
  input,
  output,
  type InputSignal,
} from "@angular/core"
import {
  fileInput,
  type FileInputDropzoneProps,
  type FileInputItemProps,
  type FileInputOptions,
} from "@ui-sdk/core/file-input"
import { optionalBoolean, optionalNumber } from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import { useFieldControl } from "./field-context.ts"
import { useNativeInput } from "./native-input.ts"
import { fileKey } from "@ui-sdk/core/renderer"
import { useId, usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type FileInputValueChange = Parameters<
  NonNullable<FileInputOptions["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<FileInputOptions["onValueChange"]>>[0]
}

/**
 * What `(reject)` emits: the value and what came with it.
 * @experimental
 */
type FileInputReject = Parameters<
  NonNullable<FileInputOptions["onReject"]>
>[1] & {
  /** The value it reports. */
  value: Parameters<NonNullable<FileInputOptions["onReject"]>>[0]
}

/**
 * The root: it holds the files, and renders the hidden file input that opens the picker and that a form submits.
 * @experimental
 */
@Directive({ selector: "[uiFileInput]", exportAs: "uiFileInput" })
class FileInput {
  readonly #field = useFieldControl()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The files to accept, like the `accept` attribute: MIME types (`"image/png"`), wildcards (`"image/*"`) and extensions (`".pdf"`), in a comma-separated string or an array. Without it, any file. */
  readonly accept: InputSignal<FileInputOptions["accept"]> = input()
  /** The most files accepted at a time. The first ones that pass the other checks are accepted, and the rest are rejected. */
  readonly maxFiles = input(undefined, { transform: optionalNumber })
  /** The largest size accepted, in bytes. */
  readonly maxSize = input(undefined, { transform: optionalNumber })
  /** The smallest size accepted, in bytes. */
  readonly minSize = input(undefined, { transform: optionalNumber })
  /** A check of your own. Return a reason, like `"duplicate"`, to reject the file, or nothing to accept it. `accepted` holds the files of the same choice, drop or paste accepted before this one. */
  readonly validate: InputSignal<FileInputOptions["validate"]> = input()
  /** The files, to control the file input. */
  readonly value: InputSignal<FileInputOptions["value"]> = input()
  /** The files at first, when uncontrolled. A form reset returns to them. */
  readonly defaultValue: InputSignal<FileInputOptions["defaultValue"]> = input()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<FileInputValueChange["value"]>()
  /** Runs when files are added or removed, with what changed in the details. `$event.cancel()` stops it. */
  readonly beforeValueChange = output<FileInputValueChange>()
  /** Runs when files fail the checks, after `onValueChange`, with every reason each failed, even when none were accepted. */
  readonly reject = output<FileInputReject>()
  /** Holds more than one file. New files join the ones it has, up to `maxFiles` in all. Without it, a new file replaces the one it has. */
  readonly multiple = input(undefined, { transform: optionalBoolean })
  /** Picks a whole folder, with every file inside it. Turns on `multiple`. */
  readonly directory = input(undefined, { transform: optionalBoolean })
  /** Opens the camera on phones instead of the files: `"user"` for the front camera, `"environment"` for the back one, or `true` for the default one. */
  readonly capture: InputSignal<FileInputOptions["capture"]> = input()
  /** The name the files submit under. Without one, nothing is submitted. */
  readonly name: InputSignal<FileInputOptions["name"]> = input()
  /** The id of a form to belong to, when it isn't inside that form. */
  readonly form: InputSignal<FileInputOptions["form"]> = input()
  /** Blocks form submission until it holds a file, with the browser's own message. */
  readonly required = input(undefined, { transform: optionalBoolean })
  /** Disables it like a native control: the trigger can't be focused or used, drops and pastes are ignored, and nothing is submitted. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** What screen readers hear after a change. Return null for nothing. */
  readonly announcement: InputSignal<FileInputOptions["announcement"]> = input()
  /** Adds and removes files from anywhere. Create one with `createFileInputController()`. */
  readonly controller: InputSignal<FileInputOptions["controller"]> = input()

  readonly handle = usePrimitive(fileInput, () => ({
    debug: this.debug(),
    accept: this.accept(),
    maxFiles: this.maxFiles(),
    maxSize: this.maxSize(),
    minSize: this.minSize(),
    validate: this.validate(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange(this.beforeValueChange, this.valueChange),
    onReject: (value, details) => this.reject.emit({ ...details, value }),
    multiple: this.multiple(),
    directory: this.directory(),
    capture: this.capture(),
    name: this.name() ?? this.#field?.name(),
    form: this.form(),
    required: this.required(),
    disabled: this.disabled() || this.#field?.disabled(),
    announcement: this.announcement(),
    controller: this.controller(),
  }))
  /** The file input's state, as a signal. */
  readonly state = usePart(this.handle, "root").state

  constructor() {
    useNativeInput(this.handle, "input")
  }
}

/**
 * Opens the file picker. Inside a Field, the field's label names it with the button's own text.
 * @experimental
 */
@Directive({ selector: "[uiFileInputTrigger]", exportAs: "uiFileInputTrigger" })
class FileInputTrigger {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(FileInput).handle, "trigger", undefined, {
    joined: useFieldControl()?.joined,
  }).state
}

/**
 * Takes dropped and pasted files. Put the trigger inside it, which is how keyboard and screen reader users choose files.
 * @experimental
 */
@Directive({
  selector: "[uiFileInputDropzone]",
  exportAs: "uiFileInputDropzone",
})
class FileInputDropzone {
  /** Where it takes drops. `"document"` takes files dropped anywhere on the page, and the zone shows `data-dragging` while files are over the window, so it can be a full-page overlay. */
  readonly target: InputSignal<FileInputDropzoneProps["target"]> = input()
  /** Somewhere else to take pasted files from, on top of pastes while focus is inside the zone: `"document"`, an element, a CSS selector, or a function that returns an element, like a prompt's text area. Text pastes are left alone. */
  readonly pasteTarget: InputSignal<FileInputDropzoneProps["pasteTarget"]> =
    input()

  readonly #id = useId()
  /** The part's state, as a signal. */
  readonly state = usePart(inject(FileInput).handle, "dropzone", () => ({
    id: this.#id,
    target: this.target(),
    pasteTarget: this.pasteTarget(),
  })).state
}

/**
 * The files, as a list. Render a FileInputItem for each file of its `state().value`.
 * @experimental
 */
@Directive({ selector: "[uiFileInputList]", exportAs: "uiFileInputList" })
class FileInputList {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(FileInput).handle, "list").state
}

/**
 * One file. Its state has the file, for its name, size and preview. Arrow keys move between items, and Backspace or Delete removes the focused one.
 * @experimental
 */
@Directive({ selector: "[uiFileInputItem]", exportAs: "uiFileInputItem" })
class FileInputItem {
  /** The file this item shows. */
  readonly file = input.required<FileInputItemProps["file"]>()

  /** The props the item and its Remove button share. */
  readonly key = computed(() => ({
    file: this.file(),
    value: fileKey(this.file()),
  }))
  /** The part's state, as a signal. */
  readonly state = usePart(inject(FileInput).handle, "item", this.key).state
}

/**
 * Removes its item's file, or the `file` it's given. It's named "Remove <file name>" unless you name it.
 * @experimental
 */
@Directive({
  selector: "[uiFileInputItemRemove]",
  exportAs: "uiFileInputItemRemove",
})
class FileInputItemRemove {
  readonly #item = inject(FileInputItem, { optional: true })
  /** The file to remove, outside a FileInputItem. */
  readonly file: InputSignal<File | undefined> = input()

  /** The part's state, as a signal. */
  readonly state = usePart(inject(FileInput).handle, "item-remove", () => {
    const file = this.file() ?? this.#item?.file()
    if (!file) {
      throw new Error(
        "FileInputItemRemove must be used inside a FileInputItem, or be given a file."
      )
    }
    return { file, value: fileKey(file) }
  }).state
}

export {
  createFileInputController,
  formatFileSize,
  relativePath,
} from "@ui-sdk/core/file-input"
export type {
  FileInputApi,
  FileInputChange,
  FileInputChangeOptions,
  FileInputController,
  FileInputDropzoneProps,
  FileInputDropzoneState,
  FileInputDropzoneTarget,
  FileInputItemProps,
  FileInputItemRemoveState,
  FileInputItemState,
  FileInputOptions,
  FileInputPasteTarget,
  FileInputPrimitive,
  FileInputState,
  FileInputTriggerProps,
  FileInputValueChangeDetails,
  FileInputValueChangeReason,
  FileLike,
  FileRejection,
  FileRejectionReason,
  FileRules,
} from "@ui-sdk/core/file-input"

export {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  type FileInputReject,
  FileInputTrigger,
  type FileInputValueChange,
}
