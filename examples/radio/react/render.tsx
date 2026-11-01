"use client"

import * as React from "react"
import { Radio, RadioGroup } from "@ui-sdk/react/radio"
import { Bell, Check, Mail, Moon } from "lucide-react"

const options = [
  { value: "all", label: "Everything", description: "Every message and update.", icon: Bell },
  { value: "mentions", label: "Mentions", description: "Only when someone mentions you.", icon: Mail },
  { value: "none", label: "Nothing", description: "Turn notifications off.", icon: Moon },
]

function Example() {
  const id = React.useId()
  return (
    <RadioGroup aria-label="Notify me about" defaultValue="mentions">
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          aria-labelledby={`${id}-notify-${option.value}-label`}
          aria-describedby={`${id}-notify-${option.value}-description`}
          render={(props, state) => (
            <button {...props}>
              <option.icon />
              <span data-slot="stack">
                <span id={`${id}-notify-${option.value}-label`}>{props.children}</span>
                <span data-slot="hint" id={`${id}-notify-${option.value}-description`}>
                  {option.description}
                </span>
              </span>
              {state.checked && <Check />}
            </button>
          )}
        >
          {option.label}
        </Radio>
      ))}
    </RadioGroup>
  )
}

export { Example }
