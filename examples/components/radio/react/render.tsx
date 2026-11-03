"use client"

import * as React from "react"
import { Radio, RadioGroup } from "@ui-sdk/react/radio"
import { BellIcon, CheckIcon, MailIcon, MoonIcon } from "lucide-react"

const options = [
  { value: "all", label: "Everything", description: "Every message and update.", icon: BellIcon },
  { value: "mentions", label: "Mentions", description: "Only when someone mentions you.", icon: MailIcon },
  { value: "none", label: "Nothing", description: "Turn notifications off.", icon: MoonIcon },
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
              {state.checked && <CheckIcon />}
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
