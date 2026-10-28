import * as React from "react"
import {
  createColorScheme,
  createLocalStorage,
  createRovingFocus,
  definePrimitive,
  type ColorSchemeState,
  type ColorSchemeValue,
} from "@ui-sdk/core"
import { createParts } from "@ui-sdk/react/primitive"
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"

type SchemePickerState = { colorScheme: ColorSchemeState; focused: string | null }

const colorScheme = createColorScheme({ storage: createLocalStorage("ui-sdk-color-scheme") })

const schemePicker = definePrimitive({
  name: "scheme-picker",
  state: (): SchemePickerState => ({ colorScheme: colorScheme.initialState, focused: null }),
  api: (context) => {
    const roving = createRovingFocus<SchemePickerState, { value: string }>(context, {
      slot: "option",
      key: "focused",
      orientation: () => "horizontal",
      preferred: (option) => option.key === context.store.get().colorScheme.value,
      claims: (state, option) => option.key === state.colorScheme.value,
    })
    return {
      roving,
      keydown(event: KeyboardEvent, el: HTMLElement) {
        const moved = roving.keydown(event, el)
        if (moved) colorScheme.set(moved.key as ColorSchemeValue, { reason: "list-navigation", event })
      },
    }
  },
  slots: (slot) => ({
    root: slot<{}, { colorScheme: ColorSchemeState }>({
      state: (state) => ({ colorScheme: state.colorScheme }),
      attrs: (state) => ({ "data-color-scheme": state.colorScheme.value }),
      bind: (_el, part) => colorScheme.follow(part.store, "colorScheme"),
    }),
    list: slot({
      attrs: () => ({ role: "radiogroup" }),
    }),
    option: slot<{ value: string }>({
      props: { value: "string" },
      attrs: (state, part) => ({
        type: "button",
        role: "radio",
        "aria-checked": String(state.colorScheme.value === part.key),
        "data-checked": state.colorScheme.value === part.key ? "" : undefined,
        tabindex: part.api.roving.tabIndex(state, part),
      }),
      press: ({ key }, event) => colorScheme.set(key as ColorSchemeValue, { reason: "item-press", event }),
      on: {
        keydown: (event, { el, api }) => {
          if (el) api.keydown(event, el)
        },
      },
      bind: (el, part) => part.api.roving.bind(el, part),
    }),
  }),
})

const parts = createParts(schemePicker, { root: "div", list: "div", option: "button" })

const SchemePicker = parts.Root

const SchemePickerList = parts.List

const SchemePickerOption = parts.Option

const choices: { value: ColorSchemeValue; label: string }[] = [
  { value: "system", label: "Default (System)" },
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
]

function Example() {
  return (
    <SchemePicker
      className={({ colorScheme }) =>
        colorScheme.resolved === "dark"
          ? "dark flex w-80 flex-col gap-5 rounded-3xl bg-card p-5 text-sm text-card-foreground shadow-sm ring-1 ring-foreground/10 transition-colors"
          : colorScheme.resolved === "light"
            ? "light flex w-80 flex-col gap-5 rounded-3xl bg-card p-5 text-sm text-card-foreground shadow-sm ring-1 ring-foreground/5 transition-colors"
            : "flex w-80 flex-col gap-5 rounded-3xl bg-card p-5 text-sm text-card-foreground shadow-sm ring-1 ring-foreground/5 transition-colors"
      }
    >
      {({ colorScheme: { value, resolved } }) => (
        <>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              {value === "system" ? (
                <MonitorIcon className="size-4" aria-hidden="true" />
              ) : resolved === "dark" ? (
                <MoonIcon className="size-4" aria-hidden="true" />
              ) : (
                <SunIcon className="size-4" aria-hidden="true" />
              )}
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-base font-medium">
                {resolved === "dark" ? "Dark" : resolved === "light" ? "Light" : "System"}
              </span>
              <span className="text-muted-foreground">
                {value === "system" ? "Following your system" : "Chosen here"}
              </span>
            </div>
          </div>
          <SchemePickerList
            aria-label="Color scheme"
            className="inline-flex h-8 w-full items-center rounded-2xl bg-muted p-[3px] text-muted-foreground"
          >
            {choices.map((choice) => (
              <SchemePickerOption
                key={choice.value}
                value={choice.value}
                className="inline-flex h-full flex-1 items-center justify-center rounded-2xl border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 outline-none transition-[color,box-shadow] hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-checked:bg-background data-checked:text-foreground data-checked:shadow-sm dark:text-muted-foreground dark:data-checked:border-input dark:data-checked:bg-input/30 dark:data-checked:text-foreground"
              >
                {choice.label}
              </SchemePickerOption>
            ))}
          </SchemePickerList>
        </>
      )}
    </SchemePicker>
  )
}

export { Example, SchemePicker, schemePicker, SchemePickerList, SchemePickerOption, type SchemePickerState }
