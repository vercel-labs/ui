"use client"

import {
  createChange,
  createPopup,
  createRovingFocus,
  createSelection,
  createTypeahead,
  definePrimitive,
  isTypeaheadKey,
  labelOf,
  popupContent,
  popupState,
  popupTrigger,
  type ChangeDetails,
} from "@ui-sdk/core"
import { popoverPreset, type PopoverOpenChangeReason } from "@ui-sdk/core/popover"
import { createParts } from "@ui-sdk/react/primitive"

type PeoplePickerOptions = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, details: ChangeDetails<PopoverOpenChangeReason | "item-press">) => void
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[], details: ChangeDetails<"item-press">) => void
}

type PeoplePickerState = ReturnType<typeof popupState> & { value: string[]; stop: string | null }

const peoplePicker = definePrimitive({
  name: "people-picker",
  options: {
    open: "boolean",
    defaultOpen: "boolean",
    onOpenChange: "callback",
    value: "value",
    defaultValue: "value",
    onValueChange: "callback",
  },
  state: (options: PeoplePickerOptions): PeoplePickerState => ({
    ...popupState(options),
    value: options.value ?? options.defaultValue ?? [],
    stop: null,
  }),
  sync: (options) => ({
    ...(options.open === undefined ? {} : { open: options.open }),
    ...(options.value === undefined ? {} : { value: options.value }),
  }),
  api: (context) => {
    const popup = createPopup(context, { preset: popoverPreset })
    const change = createChange(context)
    const roving = createRovingFocus<PeoplePickerState, { value: string }>(context, {
      slot: "option",
      key: "stop",
    })
    const selection = createSelection(context, {
      key: "value",
      set: (value, details) => change("value", value, details),
      order: () => roving.items().map((item) => item.key),
    })
    const typeahead = createTypeahead()
    let wasOpen = context.store.get().open
    context.store.subscribe(() => {
      const { open, value } = context.store.get()
      if (open === wasOpen) return
      wasOpen = open
      if (open) context.store.set({ stop: value[0] ?? null })
    })
    const pick = (key: string, event?: Event) => {
      selection.choose(key, { reason: "item-press", event })
      popup.close({ reason: "item-press", event })
    }
    return {
      ...popup,
      roving,
      pick,
      keydown(event: KeyboardEvent, el: HTMLElement, key: string) {
        if (event.key === "Enter" || (event.key === " " && !typeahead.active())) {
          event.preventDefault()
          return pick(key, event)
        }
        if (roving.keydown(event, el) || !isTypeaheadKey(event)) return
        const items = roving.items()
        const labels = items.map((item) => labelOf(item.el))
        const index = typeahead(event.key, labels, items.findIndex((item) => item.el === el))
        if (index !== -1) roving.focus(items[index].key)
      },
    }
  },
  slots: (slot) => ({
    trigger: popupTrigger(slot),
    content: popupContent(slot),
    option: slot<{ value: string }>({
      props: { value: "string" },
      attrs: (state, part) => ({
        role: "option",
        tabindex: part.api.roving.tabIndex(state, part),
        "aria-selected": String(state.value.includes(part.key)),
      }),
      press: ({ api, key }, event) => api.pick(key, event),
      on: { keydown: (event, { el, api, key }) => api.keydown(event, el!, key) },
      bind: (el, part) => part.api.roving.bind(el, part),
    }),
  }),
})

const {
  Root: PeoplePicker,
  Trigger: PeoplePickerTrigger,
  Content: PeoplePickerContent,
  Option: PeoplePickerOption,
} = createParts(peoplePicker, { trigger: "button", content: "div", option: "div" })

export { PeoplePicker, PeoplePickerContent, PeoplePickerOption, PeoplePickerTrigger }
