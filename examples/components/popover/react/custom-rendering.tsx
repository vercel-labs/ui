import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverShortcut,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover"
import { BellIcon } from "lucide-react"

export function Example() {
  return (
    <Popover>
      <PopoverTrigger
        shortcut="mod+u"
        render={(props, state) => (
          <button {...props}>
            <BellIcon />
            {state.open ? "Hide updates" : "Show updates"}
            <PopoverShortcut>{(shortcut) => shortcut.text}</PopoverShortcut>
          </button>
        )}
      />
      <PopoverContent>
        <PopoverTitle render={<h3 />}>Updates</PopoverTitle>
        <PopoverDescription>Version 2.0 is out.</PopoverDescription>
        <PopoverClose render={<a href="https://example.com/changelog" />}>Read the changelog</PopoverClose>
      </PopoverContent>
    </Popover>
  )
}
