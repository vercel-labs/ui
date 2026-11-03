import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/react/toggle"
import { TextAlignCenterIcon, TextAlignEndIcon, TextAlignStartIcon } from "lucide-react"

const alignments = [
  { value: "left", label: "Align left", icon: TextAlignStartIcon },
  { value: "center", label: "Align center", icon: TextAlignCenterIcon },
  { value: "right", label: "Align right", icon: TextAlignEndIcon },
]

function Example() {
  return (
    <ToggleGroup defaultValue={["left"]} aria-label="Text alignment">
      {alignments.map((item) => (
        <Toggle key={item.value} value={item.value} aria-label={item.label}>
          <ToggleIcon>
            <item.icon />
          </ToggleIcon>
        </Toggle>
      ))}
    </ToggleGroup>
  )
}

export { Example }
