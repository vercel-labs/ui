"use client"

import {
  createChange,
  createListbox,
  createPopup,
  createSelection,
  definePrimitive,
  elements,
  popupContent,
  popupState,
  popupTrigger,
  type ChangeDetails,
} from "@ui-sdk/core"
import {
  popoverPreset,
  type PopoverOpenChangeReason,
} from "@ui-sdk/core/popover"
import { createParts } from "@ui-sdk/react/primitive"

type UserPickerOptions = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (
    open: boolean,
    details: ChangeDetails<PopoverOpenChangeReason | "item-press">
  ) => void
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (
    value: string[],
    details: ChangeDetails<"item-press">
  ) => void
}

type UserPickerState = ReturnType<typeof popupState> & {
  value: string[]
  highlighted: string | null
}

const userPicker = definePrimitive({
  name: "user-picker",
  options: {
    open: "boolean",
    defaultOpen: "boolean",
    onOpenChange: "callback",
    value: "value",
    defaultValue: "value",
    onValueChange: "callback",
  },
  state: (options: UserPickerOptions): UserPickerState => ({
    ...popupState(options),
    value: options.value ?? options.defaultValue ?? [],
    highlighted: null,
  }),
  sync: (options) => ({
    ...(options.open === undefined ? {} : { open: options.open }),
    ...(options.value === undefined ? {} : { value: options.value }),
  }),
  api: (context) => {
    const popup = createPopup(context, { preset: popoverPreset })
    const change = createChange(context)
    const listbox = createListbox<UserPickerState>(context, {
      key: "highlighted",
    })
    const selection = createSelection(context, {
      key: "value",
      set: (value, details) => change("value", value, details),
      order: () => elements(context, "option").map((item) => item.key),
    })
    let wasOpen = context.store.get().open
    context.store.subscribe(() => {
      const { open, value } = context.store.get()
      if (open === wasOpen) {
        return
      }
      wasOpen = open
      if (open && value[0] !== undefined) {
        listbox.highlight(value[0])
      } else if (open) {
        listbox.move("first")
      }
    })
    const pick = (key: string, event?: Event) => {
      selection.choose(key, { reason: "item-press", event })
      popup.close({ reason: "item-press", event })
    }
    return {
      ...popup,
      listbox,
      pick,
      keydown(event: KeyboardEvent, key: string) {
        if (listbox.keydown(event) !== undefined) {
          return
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          pick(key, event)
        }
      },
    }
  },
  slots: (slot) => ({
    trigger: popupTrigger(slot),
    content: popupContent(slot),
    option: slot<{ value: string }>({
      props: { value: "string" },
      attrs: (state, part) => ({
        ...part.api.listbox.attrs(state, part),
        role: "option",
        tabindex: state.highlighted === part.key ? "0" : "-1",
        "aria-selected": String(state.value.includes(part.key)),
      }),
      press: ({ api, key }, event) => api.pick(key, event),
      on: {
        keydown: (event, { api, key }) => api.keydown(event, key),
      },
      bind: (el, part) => part.api.listbox.bind(el, part),
    }),
  }),
})

const {
  Root: UserPicker,
  Trigger: UserPickerTrigger,
  Content: UserPickerContent,
  Option: UserPickerOption,
} = createParts(userPicker, {
  trigger: "button",
  content: "div",
  option: "div",
})

export { UserPicker, UserPickerContent, UserPickerOption, UserPickerTrigger }
