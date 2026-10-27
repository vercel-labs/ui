import { moveIndex, radioStep } from "../../foundation/focus/collection"
import { animateIn, animateOut } from "../../foundation/motion/presence"
import { createRovingFocus } from "../../foundation/focus/roving-focus"
import {
  bindHiddenInput,
  bindInternals,
  dispatchChange,
  formInternals,
  hiddenInputStyle,
  isDisabled,
  nameFromLabels,
  submitImplicitly,
  valueMissingMessage,
} from "../../foundation/forms/form"
import { createController } from "../../foundation/kernel/controller"
import { deriveFromOptions } from "../../foundation/kernel/derive"
import type { ChangeDetails, ChangeOptions } from "../../foundation/kernel/details"
import { definePrimitive } from "../../foundation/kernel/primitive"
import type { PrimitiveContext, PrimitiveOptions, WithGeneric } from "../../foundation/kernel/primitive-types"
import { selects } from "../../foundation/kernel/selects"
import { createChange } from "../../foundation/kernel/input-source"
import { elements } from "../../foundation/kernel/elements"
import { subscribe } from "../../foundation/kernel/part"
import type { RadioGroupGeneric } from "./radio-generic"

/**
 * Why a radio group's value wants to change.
 * @stable
 */
type RadioGroupValueChangeReason = "item-press" | "list-navigation" | "reset" | "restore" | "imperative"

/**
 * Options for every write method on a controller.
 * @stable
 */
type RadioGroupChangeOptions = ChangeOptions<RadioGroupValueChangeReason>

type Details = RadioGroupChangeOptions

/**
 * Checks and inspects a radio group from outside it. Pass it as the `controller` option.
 * @stable
 */
function createRadioGroupController<T extends string = string>() {
  return createController<{
    /** The checked radio's value. */
    getValue: () => T | null
    /** Checks a radio, as a user would. Disabled radios and read-only groups ignore it. */
    setValue: (value: T | null, details?: Details) => boolean
    /** Moves focus to the checked radio, or the first one. */
    focus: () => void
  }>()
}

/**
 * A controller from `createRadioGroupController()`. Pass it as the
 * `controller` option.
 * @stable
 */
type RadioGroupController<T extends string = string> = ReturnType<typeof createRadioGroupController<T>>

/**
 * The options `radioGroup` takes. A component takes them as props on its root.
 * @stable
 */
type RadioGroupOptions<T extends string = string> = {
  /** The checked radio's value. Pass it to control the group. `null` checks nothing. */
  value?: T | null
  /** The radio checked at first, when uncontrolled. A form reset returns to it. */
  defaultValue?: T | null
  /** Runs when a user or a form reset wants to change the value. `details.reason` says why, and `details.cancel()` stops it. */
  onValueChange?: (value: T | null, details: ChangeDetails<RadioGroupValueChangeReason>) => void
  /** Disables every radio like native ones: they can't be focused or changed, and the value isn't submitted. */
  disabled?: boolean
  /** Keeps the items focusable and the value submitted, but stops changes. */
  readOnly?: boolean
  /** Blocks form submission until an item is checked, with the browser's own message. */
  required?: boolean
  /** The name the value submits under. Without one, the group submits nothing. */
  name?: string
  /** The id of a form to belong to, when the group isn't inside that form. */
  form?: string
  /**
   * Whether arrow keys wrap from the last item to the first.
   * @defaultValue true
   */
  loop?: boolean
  /** Checks radios from anywhere. Create one with `createRadioGroupController()`. */
  controller?: RadioGroupController<T>
} & PrimitiveOptions

type ItemProps = {
  /** What the group's value becomes when this item is checked. */
  value: string
  /** Skips the item, like a disabled native radio: arrow keys pass it and it can't be focused or checked. */
  disabled?: boolean
}

type IndicatorProps = {
  /** The value of the item the indicator belongs to. Set for you inside an item. */
  value?: string
  /**
   * Whether the indicator stays in the page while its item is unchecked.
   * @defaultValue false
   */
  keepMounted?: boolean
}

/**
 * The props the `root` slot of a radio item takes: its `value` and `disabled`.
 * @stable
 */
type RadioProps = ItemProps
/**
 * The props the `indicator` slot of `radioGroup` takes, inside a radio item.
 * @stable
 */
type RadioIndicatorProps = Omit<IndicatorProps, "value">

/**
 * The state the `root` slot of `radioGroup` hands `render` functions and
 * state-based class names.
 * @stable
 */
type RadioGroupState = {
  /** The checked item's value. */
  value: string | null
  /** Whether the group is disabled, by itself or by a `<fieldset>`. */
  disabled: boolean
  /** Whether the group is read-only: arrow keys still move focus, but nothing changes the checked item. */
  readOnly: boolean
  /** Whether a form won't submit until an item is checked. */
  required: boolean
}
/**
 * The state a radio item hands `render` functions and state-based class names.
 * @stable
 */
type RadioState = {
  /** Whether this item is checked. */
  checked: boolean
  /** Whether this item is disabled, by itself, its group or a `<fieldset>`. */
  disabled: boolean
  /** Whether the group is read-only. */
  readOnly: boolean
  /** Whether the group is required. */
  required: boolean
}
/**
 * The state the `indicator` slot of `radioGroup` hands `render` functions and
 * state-based class names.
 * @stable
 */
type RadioIndicatorState = RadioState

type RadioGroupState_ = {
  value: string | null
  // What a form reset returns to: the first value.
  initial: string | null
  disabled: boolean
  readOnly: boolean
  required: boolean
  name: string | undefined
  form: string | undefined
  formDisabled: boolean
  // The item Tab lands on: the checked one, or the first enabled one when that
  // can't take focus. Null until items bind.
  stop: string | null
  // Indicators animating out.
  exiting: string[]
}

const isNativeButton = (el: HTMLElement | undefined) => el instanceof HTMLButtonElement

function radioGroupApi(context: PrimitiveContext<RadioGroupOptions, RadioGroupState_, string>) {
  const { id, store, options, element, props } = context
  const change = createChange(context)
  let changed = false

  const enabled = (item: { props: ItemProps | undefined }) =>
    !item.props?.disabled && !isDisabled(store.get())
  // Like native radios: both axes move, disabled items are skipped, and Tab
  // lands on the checked item. Before items bind, the checked item holds the
  // stop, or with nothing checked, the first enabled one claims it. Disabling
  // the group is a change of state, which moves the stop on its own.
  const roving = createRovingFocus<RadioGroupState_, ItemProps>(context, {
    slot: "root",
    key: "stop",
    remember: false,
    disabled: (item) => !enabled(item),
    focusable: enabled,
    preferred: (item) => store.get().value === item.key,
    claims: (state, item) => (state.value ?? item.key) === item.key,
    move(event, { from, items, rtl }) {
      if (event.shiftKey) return
      const step = radioStep(event.key, rtl)
      if (step === undefined) return
      return items[moveIndex(items.indexOf(from), step, items.length, options().loop ?? true)].key
    },
  })
  // The indicators animating out once `value` replaces `from`.
  const exitingAfter = (from: string | null, value: string | null, exiting: string[]) => [
    ...exiting.filter((key) => key !== value),
    ...(from !== null && hasIndicator(from) && !exiting.includes(from) ? [from] : []),
  ]

  // A controlled `value` moves the indicator and the tab stop in the same pass.
  deriveFromOptions(context, ["exiting", "stop"], (synced, state) => {
    if (!("value" in synced) || synced.value === state.value) return
    const value = (synced.value ?? null) as string | null
    const stop = roving.stopFor((item) => item.key === value)
    return { exiting: exitingAfter(state.value, value, state.exiting), ...(stop !== undefined && { stop }) }
  })

  let previous = store.get().value
  store.subscribe(() => {
    const { value, exiting } = store.get()
    if (value === previous) return
    const from = previous
    previous = value
    changed = true
    store.set({ exiting: exitingAfter(from, value, exiting) })
    roving.check()
  })

  // Indicators are keyed by their item's value, so this is a lookup, not a sort.
  const hasIndicator = (value: string) => !!element("indicator", value)?.isConnected

  const formElement = () => {
    const root = element("group")
    if (formInternals(root)) return root
    const { value } = store.get()
    return value === null ? undefined : element("input", value)
  }

  const api = {
    id,
    getValue: () => store.get().value,
    isChanged: () => changed,
    // Checks a radio, as a user would. Disabled radios and read-only groups ignore it.
    setValue(value: string | null, { reason = "imperative", event }: Details = {}) {
      const details = { reason, event }
      const state = store.get()
      if (isDisabled(state) || state.readOnly) return false
      if (value !== null && (props("root", value) as ItemProps | undefined)?.disabled) return false
      const done = change("value", value, details)
      if (done) dispatchChange(formElement())
      return done
    },
    // Moves focus to the item that holds the tab stop, the checked one if it is enabled.
    focus: () => roving.focus(),
    form: () =>
      formInternals(element("group"))?.form ??
      (elements(context, "input")[0]?.el as HTMLInputElement | undefined)?.form ??
      null,
    internal: {
      reset() {
        change("value", store.get().initial, { reason: "reset" })
      },
      setFormDisabled(formDisabled: boolean) {
        store.set({ formDisabled })
      },
      finishExit(key: string) {
        store.set({ exiting: store.get().exiting.filter((value) => value !== key) })
      },
      roving,
      radio: (key: string) => element("root", key),
      // The props its item rendered with, for parts inside an item.
      itemProps: (key: string) => (props("root", key) ?? {}) as { disabled?: boolean },
      anchor: () => (roving.items()[0] ?? elements(context, "root")[0])?.el,
      onKeyDown(event: KeyboardEvent, el: HTMLElement) {
        if (event.altKey || event.ctrlKey || event.metaKey) return
        if (event.key === "Enter") {
          // Enter submits the form, like on a native radio.
          event.preventDefault()
          if (!event.repeat) submitImplicitly(api.form())
          return
        }
        if (event.key === " ") {
          if (!isNativeButton(el)) event.preventDefault()
          return
        }
        const moved = roving.keydown(event, el)
        // Like native radios, moving checks the item.
        if (moved && moved.key !== moved.from && !store.get().readOnly)
          api.setValue(moved.key, { reason: "list-navigation", event })
      },
    },
  }
  return api
}

/**
 * `radioGroup`'s api, which its slots and controller call.
 * Adapters expose it as `api`.
 * @stable
 */
type RadioGroupApi = ReturnType<typeof radioGroupApi>

function itemState(state: RadioGroupState_, key: string, props: { disabled?: boolean }) {
  return {
    checked: state.value === key,
    disabled: !!props.disabled || isDisabled(state),
    readOnly: state.readOnly,
    required: state.required,
  }
}

function itemData(state: RadioGroupState_, key: string, props: { disabled?: boolean }) {
  const { checked, disabled } = itemState(state, key, props)
  return {
    "data-checked": checked ? "" : undefined,
    "data-unchecked": checked ? undefined : "",
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": state.readOnly ? "" : undefined,
    "data-required": state.required ? "" : undefined,
  }
}

const radioGroupPrimitive = /* @__PURE__ */ definePrimitive({
  name: "radio",
  options: {
    value: "string",
    defaultValue: "string",
    onValueChange: "callback",
    disabled: "boolean",
    readOnly: "boolean",
    required: "boolean",
    name: "string",
    form: "string",
    loop: "boolean",
    controller: "value",
  },
  state: (options: RadioGroupOptions): RadioGroupState_ => {
    const value = options.value !== undefined ? options.value : (options.defaultValue ?? null)
    return {
      value,
      initial: value,
      disabled: !!options.disabled,
      readOnly: !!options.readOnly,
      required: !!options.required,
      name: options.name,
      form: options.form,
      formDisabled: false,
      stop: null,
      exiting: [],
    }
  },
  sync: (options) => ({
    disabled: !!options.disabled,
    readOnly: !!options.readOnly,
    required: !!options.required,
    name: options.name,
    form: options.form,
    // Like a native radio's `defaultChecked`, changing it changes what a reset returns to.
    ...(options.defaultValue === undefined ? {} : { initial: options.defaultValue }),
    ...(options.value === undefined ? {} : { value: options.value }),
  }),
  api: radioGroupApi,
  slots: (slot) => ({
    group: slot<{}, RadioGroupState>({
      state: (state) => ({
        value: state.value,
        disabled: isDisabled(state),
        readOnly: state.readOnly,
        required: state.required,
      }),
      attrs: (state) => ({
        role: "radiogroup",
        "aria-required": state.required ? "true" : undefined,
        "aria-readonly": state.readOnly ? "true" : undefined,
        "aria-disabled": isDisabled(state) ? "true" : undefined,
        "data-disabled": isDisabled(state) ? "" : undefined,
        "data-readonly": state.readOnly ? "" : undefined,
        "data-required": state.required ? "" : undefined,
      }),
      bind: (el, { api, store }) => {
        const unbind = bindInternals(el, {
          value: () => store.get().value,
          state: () => store.get().value ?? "",
          restore: (saved) => api.setValue(saved || null, { reason: "restore" }),
          valueMissing: () => store.get().required && store.get().value === null,
          message: () => valueMissingMessage("radio"),
          anchor: api.internal.anchor,
          focus: api.focus,
          reset: api.internal.reset,
          disabled: api.internal.setFormDisabled,
          subscribe: store.subscribe,
        })
        // A label pointing at the group moves focus into it.
        const onClick = (event: MouseEvent) => {
          if (event.target === el) api.focus()
        }
        // A press on a label would focus a radio the group disables, which
        // stays focusable to scripts. Like a disabled native radio, it doesn't
        // take focus. Browsers send no mouse events into a disabled form
        // element, like a web component group, so this listens for focus. An
        // enabled group never looks for the label.
        let pressedLabel: HTMLLabelElement | null = null
        const onPointerDown = (event: PointerEvent) => {
          pressedLabel = isDisabled(store.get())
            ? ((event.target as Element | null)?.closest?.("label") ?? null)
            : null
        }
        const onFocusIn = (event: FocusEvent) => {
          const label = pressedLabel
          pressedLabel = null
          const target = event.target as HTMLElement
          if (label?.control === target && target !== el) target.blur()
        }
        const doc = el.ownerDocument
        el.addEventListener("click", onClick)
        el.addEventListener("focusin", onFocusIn)
        doc.addEventListener("pointerdown", onPointerDown, true)
        return () => {
          unbind()
          el.removeEventListener("click", onClick)
          el.removeEventListener("focusin", onFocusIn)
          doc.removeEventListener("pointerdown", onPointerDown, true)
        }
      },
    }),

    root: slot<ItemProps, RadioState>({
      props: { value: "string", disabled: "boolean" },
      // Until there's a stop, the checked item holds it, or with nothing
      // checked, the first enabled one claims it: those hear a change to null.
      // Radios never read which indicators are exiting.
      selects: selects({ value: ({ key }) => [key, null], stop: ({ key }) => [key, null], exiting: [] }),
      state: (state, { key, props }) => itemState(state, key, props),
      attrs: (state, { key, props, api }) => {
        const { checked, disabled } = itemState(state, key, props)
        return {
          role: "radio",
          type: "button",
          "aria-checked": String(checked),
          // Disabled items are skipped, like native radios.
          disabled: props.disabled ? "" : undefined,
          "aria-disabled": disabled ? "true" : undefined,
          tabindex: disabled
            ? props.disabled
              ? undefined
              : "-1"
            : api.internal.roving.tabIndex(state, { key, props }),
          ...itemData(state, key, props),
        }
      },
      press({ api, key, props }, event) {
        // A click inside the radio would make a <label> around it click it again
        // in Firefox and Safari.
        event?.preventDefault()
        if (props.disabled) return
        api.setValue(key, { reason: "item-press", event })
      },
      on: {
        // A group's disabled leaves the item focusable to scripts, so a press
        // mustn't focus it either, like a disabled native radio.
        mousedown: (event, { store, key, props }) => {
          if (itemState(store.get(), key, props).disabled) event.preventDefault()
        },
        keydown: (event, { api, el }) => api.internal.onKeyDown(event, el!),
        keyup: (event, { api, el, key, props }) => {
          if (event.key === " " && !isNativeButton(el) && !props.disabled)
            api.setValue(key, { reason: "item-press", event })
        },
      },
      bind(el, part) {
        const unregister = part.api.internal.roving.bind(el, part)
        const unname = nameFromLabels(el)
        return () => {
          unname()
          unregister()
        }
      },
    }),

    // React and Vue: a native radio per item, so the form submits, resets and validates them.
    input: slot<ItemProps>({
      props: { value: "string", disabled: "boolean" },
      attrs: (state, { id, key, props }) => ({
        type: "radio",
        // Required radios need a group to validate as one.
        name: state.name ?? (state.required ? id : undefined),
        value: key,
        form: state.form,
        checked: state.initial === key ? "" : undefined,
        required: state.required ? "" : undefined,
        disabled: state.disabled || props.disabled ? "" : undefined,
        "aria-hidden": "true",
        tabindex: "-1",
        style: hiddenInputStyle,
      }),
      bind: (el, { api, store, key }) =>
        bindHiddenInput(el as HTMLInputElement, {
          checked: () => store.get().value === key,
          subscribe: store.subscribe,
          // The browser focuses an invalid radio on submit. Focus goes to the group's tab stop.
          focus: api.focus,
          control: () => api.internal.radio(key),
          activate: (event) => {
            if (!api.internal.itemProps(key).disabled) api.setValue(key, { reason: "item-press", event })
          },
          reset: api.internal.reset,
          disabled: api.internal.setFormDisabled,
        }),
    }),

    indicator: slot<IndicatorProps, RadioIndicatorState>({
      props: { value: { kind: "string", from: "root" }, keepMounted: "boolean" },
      // Keyed by the item's value, which every renderer fills from the item
      // around it, so it's set by now. Indicators never read the tab stop,
      // which moves with every arrow key, and only ask whether their own value
      // is exiting.
      selects: selects({
        value: ({ props }) => [props.value!],
        stop: [],
        exiting: ({ props }) => [props.value!],
      }),
      present: (state, { props: { value, keepMounted } }) =>
        !!keepMounted || state.value === value || state.exiting.includes(value!),
      state: (state, { props: { value }, api }) => itemState(state, value!, api.internal.itemProps(value!)),
      attrs: (state, { props: { value }, api }) => itemData(state, value!, api.internal.itemProps(value!)),
      bind(el, part) {
        const { api, store, props } = part
        const key = props.value!
        let stop: (() => void) | undefined
        let shown = store.get().value === key
        if (shown && api.isChanged()) stop = animateIn(el)
        const unsubscribe = subscribe(part, () => {
          const { value, exiting } = store.get()
          if ((value === key) === shown) return
          shown = value === key
          stop?.()
          stop = undefined
          // Ahead of the render, for exit keyframes keyed on the state.
          el.toggleAttribute("data-checked", shown)
          el.toggleAttribute("data-unchecked", !shown)
          if (shown) stop = animateIn(el)
          else if (exiting.includes(key) || props.keepMounted)
            stop = animateOut(el, () => {
              stop = undefined
              api.internal.finishExit(key)
            })
        })
        return () => {
          unsubscribe()
          stop?.()
        }
      },
    }),
  }),
  agent: { actions: ["setValue"], closed: true },
})
/**
 * The type of `radioGroup`.
 * @stable
 */
interface RadioGroupPrimitive extends WithGeneric<typeof radioGroupPrimitive, RadioGroupGeneric> {}

/**
 * The radio group primitive, with the slots `group`, `root`, `input`,
 * `indicator`.
 * Render it with an adapter's `usePrimitive`, or compose it inside your own
 * primitive.
 * @stable
 */
const radioGroup = radioGroupPrimitive as RadioGroupPrimitive

export {
  createRadioGroupController,
  radioGroup,
  type RadioGroupApi,
  type RadioGroupChangeOptions,
  type RadioGroupController,
  type RadioGroupOptions,
  type RadioGroupPrimitive,
  type RadioGroupState,
  type RadioGroupValueChangeReason,
  type RadioIndicatorProps,
  type RadioIndicatorState,
  type RadioProps,
  type RadioState,
}
