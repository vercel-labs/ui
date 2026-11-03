import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

const sizes = ["Extra small", "Small", "Medium", "Large", "Extra large"]

export function Example() {
  return (
    <div data-slot="stack">
      <Select placeholder="Select a size">
        <div data-slot="stack">
          <SelectLabel>Size</SelectLabel>
          <SelectTrigger>
            <SelectValue />
            <ChevronDownIcon />
          </SelectTrigger>
        </div>
        <SelectContent>
          {sizes.map((size) => (
            <SelectItem key={size} value={size}>
              {size}
              <SelectItemIndicator>
                <CheckIcon />
              </SelectItemIndicator>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select>
        <div data-slot="stack">
          <SelectLabel>Gift wrap</SelectLabel>
          <SelectTrigger>
            <SelectValue placeholder="None" />
            <ChevronDownIcon />
          </SelectTrigger>
        </div>
        <SelectContent>
          {["Paper", "Ribbon", "Box"].map((wrap) => (
            <SelectItem key={wrap} value={wrap}>
              {wrap}
              <SelectItemIndicator>
                <CheckIcon />
              </SelectItemIndicator>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
