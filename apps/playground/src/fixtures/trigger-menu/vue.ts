import {
  Textarea,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuHint,
  TriggerMenuInput,
  TriggerMenuStatus,
} from "@ui-sdk/vue"
import {
  fixtureTriggers,
  selectAction,
  triggerMenuFixture as f,
  triggerMenuOptions,
} from "tests/fixtures/trigger-menu.ts"
import { createApp, defineComponent, h, ref, useId } from "vue"
import { renderAs } from "../vue-render-as"
import TriggerMenuFixtureList from "./TriggerMenuFixtureList.vue"

const Composer = defineComponent({
  props: { name: { type: String, required: true } },
  emits: ["action", "open"],
  setup(props, { emit }) {
    const { input, textarea, empty, autoHighlight } = triggerMenuOptions()
    const triggers = fixtureTriggers()
    const id = useId()
    return () =>
      h(
        TriggerMenu,
        {
          triggers,
          autoHighlight,
          onOpenChange: (open: boolean, details: { reason: string }) =>
            emit("open", `${open}:${details.reason}`),
          onSelect: (
            value: unknown,
            details: { arguments: Record<string, string> }
          ) => emit("action", selectAction(value, details.arguments)),
        },
        () => [
          h("label", { class: "label", for: id }, props.name),
          h(
            TriggerMenuInput,
            { id, name: "message", class: "input" },
            renderAs(input ? "input" : textarea ? Textarea : undefined)
          ),
          h(TriggerMenuHint, { class: "hint" }),
          h(TriggerMenuStatus, { class: "status" }),
          h(TriggerMenuContent, { class: "popup list-popup" }, () => [
            empty && h(TriggerMenuEmpty, { class: "empty" }, () => f.empty),
            h(TriggerMenuFixtureList),
          ]),
        ]
      )
  },
})

const Fixture = defineComponent({
  setup() {
    const { twice } = triggerMenuOptions()
    const action = ref("")
    const open = ref("")
    const submitted = ref("")
    const composer = (name: string) =>
      h(Composer, {
        name,
        onAction: (value: string) => (action.value = value),
        onOpen: (value: string) => (open.value = value),
      })
    return () =>
      h("div", { class: "fixture" }, [
        h("button", "Before"),
        h(
          "form",
          {
            class: "composer",
            "aria-label": f.formLabel,
            onSubmit: (event: SubmitEvent) => {
              event.preventDefault()
              submitted.value = String(
                new FormData(event.currentTarget as HTMLFormElement).get(
                  "message"
                )
              )
            },
          },
          [
            composer(f.label),
            twice && composer("Second"),
            h("button", { type: "submit" }, f.submit),
          ]
        ),
        h("button", "After"),
        h(
          "output",
          { role: "status", "aria-label": "Last action" },
          action.value
        ),
        h("output", { role: "status", "aria-label": "Open" }, open.value),
        h(
          "output",
          { role: "status", "aria-label": "Submitted" },
          submitted.value
        ),
      ])
  },
})

function mount(root: HTMLElement) {
  createApp(Fixture).mount(root)
}

export { Fixture, mount }
