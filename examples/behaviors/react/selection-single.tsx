import * as React from "react"
import {
  createChange,
  createRovingFocus,
  createSelection,
  definePrimitive,
  selects,
  type ChangeDetails,
} from "@ui-sdk/core"
import { createParts } from "@ui-sdk/react/primitive"

type PlansState = { value: string[]; focused: string | null }

type PlansOptions = {
  onValueChange?: (value: string[], details: ChangeDetails<"item-press">) => void
  onContinue?: (plan: string) => void
}

const plans = definePrimitive({
  name: "plans",
  options: { onValueChange: "callback", onContinue: "callback" },
  state: (_options: PlansOptions): PlansState => ({ value: [], focused: null }),
  api: (context) => {
    const change = createChange(context)
    const roving = createRovingFocus<PlansState, { value: string }>(context, {
      slot: "plan",
      key: "focused",
      orientation: () => "vertical",
    })
    const selection = createSelection(context, {
      key: "value",
      set: (value, details) => change("value", value, details),
      order: () => roving.items().map((item) => item.key),
    })
    return {
      roving,
      selection,
      keydown(event: KeyboardEvent, el: HTMLElement, key: string) {
        if (event.key === " ") {
          event.preventDefault()
          selection.toggle(key, { reason: "item-press", event })
        } else if (event.key === "Enter" && selection.isSelected(key)) context.options().onContinue?.(key)
        else roving.keydown(event, el)
      },
    }
  },
  slots: (slot) => ({
    root: slot({ attrs: () => ({ role: "listbox" }) }),
    plan: slot<{ value: string }>({
      props: { value: "string" },
      selects: selects({ focused: ({ key }) => [key, null] }),
      attrs: (state, part) => ({
        role: "option",
        "aria-selected": String(state.value.includes(part.key)),
        tabindex: part.api.roving.tabIndex(state, part),
      }),
      on: {
        keydown: (event, { el, api, key }) => api.keydown(event, el!, key),
        pointerdown: (event, { api, key }) => api.selection.choose(key, { reason: "item-press", event }),
      },
      bind: (el, part) => part.api.roving.bind(el, part),
    }),
  }),
})

const parts = createParts(plans, { root: "div", plan: "div" })

const Plans = parts.Root

const PlansPlan = parts.Plan

const names = ["Free", "Pro", "Team"]

function Example() {
  const [chosen, setChosen] = React.useState<string[]>([])
  const [going, setGoing] = React.useState<string | null>(null)
  return (
    <div data-slot="stack">
      <Plans aria-label="Plan" onValueChange={setChosen} onContinue={setGoing}>
        {names.map((name) => (
          <PlansPlan key={name} value={name}>
            {name}
          </PlansPlan>
        ))}
      </Plans>
      <p data-chosen data-slot="output">
        {going ? `Continuing with ${going}` : chosen.length ? `Chosen: ${chosen[0]}` : "No plan chosen"}
      </p>
    </div>
  )
}

export { Example, plans, Plans, PlansPlan, type PlansOptions, type PlansState }
