"use client"

import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/react/toggle"
import { BookmarkIcon, HeartIcon, StarIcon } from "lucide-react"

const reactions = [
  { value: "star", label: "Favorite", icon: StarIcon },
  { value: "heart", label: "Like", icon: HeartIcon },
  { value: "bookmark", label: "Save", icon: BookmarkIcon },
]

function Example() {
  return (
    <ToggleGroup multiple aria-label="Reactions" data-variant="framed">
      {reactions.map((item) => (
        <Toggle
          key={item.value}
          value={item.value}
          aria-label={item.label}
          render={(props, state) => (
            <button {...props}>
              <ToggleIcon>
                <item.icon fill={state.pressed ? "currentColor" : "none"} />
              </ToggleIcon>
            </button>
          )}
        />
      ))}
    </ToggleGroup>
  )
}

export { Example }
