import {
  createFileInputController,
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
import { createApp, defineComponent, h, ref, type PropType } from "vue"
import { classes as c, renderShell } from "./shell"
import {
  announcementFor,
  describe,
  sampleFile,
  validateName,
  type Variant,
} from "./variants"

const Card = defineComponent({
  props: {
    variant: { type: Object as PropType<Variant>, required: true },
    log: { type: Function as PropType<(text: string) => void>, required: true },
  },
  setup(props) {
    const controller = createFileInputController()
    const files = ref<File[]>([])
    const note = ref<HTMLTextAreaElement | null>(null)
    const button = (label: string, onClick: () => void) =>
      h("button", { type: "button", class: c.button, onClick }, label)
    return () => {
      const variant = props.variant
      const page = typeof variant.dropzone === "object"
      const trigger = () =>
        variant.trigger &&
        h(FileInputTrigger, { class: c.button }, () => "Choose files")
      const zone = () =>
        h(
          FileInputDropzone,
          {
            class: page ? c.page : c.zone,
            target: page ? "document" : undefined,
            pasteTarget: variant.pasteTarget ? () => note.value : undefined,
          },
          () => [
            h("span", page ? "Drop files anywhere" : "Drop files here"),
            trigger(),
            variant.nested &&
              h(
                FileInput,
                {
                  onValueChange: (
                    _: File[],
                    details: FileInputValueChangeDetails
                  ) => props.log(`inner ${describe(details)}`),
                },
                () =>
                  h(FileInputDropzone, { class: c.zone }, () => "Inner zone")
              ),
          ]
        )
      const list = () =>
        h(FileInputList, { class: c.list, "aria-label": "Files" }, () =>
          h(
            FileInputItem,
            { class: c.item },
            {
              default: ({ state }: { state: { file: File } }) => [
                state.file.name,
                h(FileInputItemRemove, { class: c.remove }, () => "×"),
              ],
            }
          )
        )
      const input = h(
        FileInput,
        {
          class: c.root,
          ...variant.props,
          value: variant.controlled ? files.value : undefined,
          validate: variant.validate ? validateName : undefined,
          announcement: announcementFor(variant),
          controller: variant.controller ? controller : undefined,
          onValueChange: (
            value: File[],
            details: FileInputValueChangeDetails
          ) => {
            props.log(describe(details))
            files.value = value
          },
          onReject: (rejected: FileRejection[], details: { reason: string }) =>
            props.log(describe({ ...details, rejected })),
        },
        () => [variant.dropzone ? zone() : trigger(), variant.list && list()]
      )
      return h("form", { class: c.form }, [
        page && h("span", "Drag files over the window."),
        variant.field
          ? h(Field, null, () => [
              h(FieldLabel, null, () => "Files"),
              input,
              h(FieldDescription, { class: c.description }, () => "Required."),
              h(FieldError, { class: c.error }),
            ])
          : input,
        variant.pasteTarget &&
          h("textarea", {
            ref: note,
            class: c.note,
            "aria-label": "Paste here",
          }),
        variant.controller &&
          h("div", { class: "flex gap-2" }, [
            button("Add a sample file", () =>
              controller.addFiles([sampleFile()])
            ),
            button("Open the picker", () => controller.open()),
            button("Clear", () => controller.clear()),
          ]),
        h("div", { class: "flex gap-2" }, [
          h("button", { type: "submit", class: c.button }, "Submit"),
          h("button", { type: "reset", class: c.button }, "Reset"),
        ]),
      ])
    }
  },
})

function mount(root: HTMLElement) {
  renderShell(root, (slot, variant, log) =>
    createApp(Card, { variant, log }).mount(slot)
  )
}

export { mount }
