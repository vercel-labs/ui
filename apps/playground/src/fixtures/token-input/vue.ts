import {
  fromText,
  toText,
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenRemove,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuHint,
  type TokenInputValue,
  type TriggerMenuSelectDetails,
} from "@ui-sdk/vue"
import {
  pendingSelect,
  tokenInputFixture as f,
  tokenInputOptions,
  tokenTriggers,
} from "tests/fixtures/token-input.ts"
import { createApp, defineComponent, h, ref } from "vue"
import TriggerMenuFixtureList from "../trigger-menu/TriggerMenuFixtureList.vue"

const Fixture = defineComponent({
  setup() {
    const { value, pending, fail, form, otherForm, controlled, ...options } =
      tokenInputOptions()
    const action = ref("")
    const submitted = ref("")
    const triggers = tokenTriggers()
    const initial = fromText(value)
    const current = ref<TokenInputValue>(initial)
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
                new FormData(event.currentTarget as HTMLFormElement).get(f.name)
              )
            },
          },
          [
            h(
              TokenInput,
              {
                ...options,
                name: f.name,
                form: otherForm ? "other" : undefined,
                defaultValue: controlled ? undefined : initial,
                value: controlled ? current.value : undefined,
                onValueChange: (
                  next: TokenInputValue,
                  details: { reason: string }
                ) => {
                  current.value = next
                  action.value = `${details.reason}:${toText(next)}`
                },
                onSubmit: form
                  ? undefined
                  : (next: TokenInputValue) => (submitted.value = toText(next)),
              },
              {
                default: () => [
                  h("label", { class: "label", id: "prompt-label" }, f.label),
                  h(TokenInputEditor, {
                    "aria-labelledby": "prompt-label",
                    class: "editor",
                    placeholder: f.placeholder,
                  }),
                  h(
                    TriggerMenu,
                    {
                      triggers,
                      onSelect: (
                        selected: unknown,
                        details: TriggerMenuSelectDetails<unknown>
                      ) =>
                        pending && details.trigger === "@"
                          ? pendingSelect({ fail })
                          : undefined,
                    },
                    () => [
                      h(TriggerMenuHint, { class: "hint" }),
                      h(TriggerMenuContent, { class: "popup list-popup" }, () =>
                        h(TriggerMenuFixtureList)
                      ),
                    ]
                  ),
                ],
                token: ({ token }: { token: { label: string } }) =>
                  h(TokenInputToken, { class: "token" }, () => [
                    token.label,
                    h(TokenInputTokenRemove, () => " ×"),
                  ]),
              }
            ),
            h("button", { type: "submit" }, f.submit),
          ]
        ),
        otherForm &&
          h("form", {
            id: "other",
            "aria-label": "Other",
            onSubmit: (event: SubmitEvent) => {
              event.preventDefault()
              const data = new FormData(event.currentTarget as HTMLFormElement)
              submitted.value = `other:${data.get(f.name)}`
            },
          }),
        h("textarea", { "aria-label": f.scratch }),
        h("button", "After"),
        h(
          "output",
          { role: "status", "aria-label": "Last action" },
          action.value
        ),
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
