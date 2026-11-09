import { Checkbox, CheckboxGroup } from "@ui-sdk/react/checkbox"
import {
  Menu,
  MenuContent,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@ui-sdk/react/menu"
import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle"
import * as React from "react"
import { createRoot } from "react-dom/client"

// A controlled group, changed in a transition, whose newly selected item
// suspends as it renders selected. ?group= picks menu, toggle or checkbox.
// The page counts the item's tries to render its details, and marks the body
// once the fallback shows. `window.loadDetails()` lets the details through.

type Page = { detailsRendered: number; loadDetails: () => void }
const page = window as unknown as Page
page.detailsRendered = 0
const details = new Promise<void>((resolve) => (page.loadDetails = resolve))

function Details() {
  page.detailsRendered++
  React.use(details)
  return <span> details</span>
}

function Fallback() {
  React.useLayoutEffect(() => {
    document.body.dataset.fellBack = ""
  }, [])
  return <p>Loading</p>
}

function Group({
  value,
  choose,
}: {
  value: string
  choose: (value: string) => void
}) {
  const group = new URLSearchParams(location.search).get("group")
  if (group === "toggle") {
    return (
      <ToggleGroup
        value={[value]}
        onValueChange={([next]) => next && choose(next)}
      >
        <Toggle value="left">Left</Toggle>
        <Toggle value="right">
          {(state) => <>Right{state.pressed && <Details />}</>}
        </Toggle>
      </ToggleGroup>
    )
  }
  if (group === "checkbox") {
    return (
      <CheckboxGroup
        value={[value]}
        onValueChange={(next) =>
          choose(next.find((item) => item !== value) ?? value)
        }
      >
        <Checkbox value="left" aria-label="Left" />
        <Checkbox value="right" aria-label="Right">
          {(state) => state.checked === true && <Details />}
        </Checkbox>
      </CheckboxGroup>
    )
  }
  return (
    <Menu defaultOpen modal={false}>
      <MenuTrigger>Align</MenuTrigger>
      <MenuContent>
        <MenuRadioGroup value={value} onValueChange={choose}>
          <MenuRadioItem value="left" closeOnSelect={false}>
            Left
          </MenuRadioItem>
          <MenuRadioItem value="right" closeOnSelect={false}>
            {(state) => <>Right{state.checked && <Details />}</>}
          </MenuRadioItem>
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  )
}

function Fixture() {
  const [value, setValue] = React.useState("left")
  return (
    <div className="fixture">
      <button>Before</button>
      <React.Suspense fallback={<Fallback />}>
        <Group
          value={value}
          choose={(next) => React.startTransition(() => setValue(next))}
        />
      </React.Suspense>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Fixture />)
}

export { mount }
