import { Button } from "@ui-sdk/react/button"
import { Separator } from "@ui-sdk/react/separator"
import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle"
import * as React from "react"
import { createRoot } from "react-dom/client"

function Fixture() {
  const [action, setAction] = React.useState("")
  return (
    <div className="fixture">
      <button>Before</button>
      <Button
        className="button"
        render={<span />}
        onClick={() => setAction("span")}
      >
        Span button
      </Button>
      <Button className="button" disabled render={<a href="#old" />}>
        Old docs
      </Button>
      <Toggle
        className={(state) =>
          `toggle ${state.pressed ? "is-pressed" : "is-unpressed"}`
        }
        onPressedChange={(pressed) => setAction(pressed ? "star" : "unstar")}
      >
        {(state) => (
          <>
            <span aria-hidden="true">{state.pressed ? "★" : "☆"}</span> Star
          </>
        )}
      </Toggle>
      <ToggleGroup
        className="toggle-group"
        aria-label="View"
        defaultValue={["grid"]}
        onValueChange={(value) => setAction(value.join(", "))}
      >
        <Toggle className="toggle" value="grid" render={<span />}>
          Grid
        </Toggle>
        <Toggle className="toggle" value="list" render={<span />}>
          List
        </Toggle>
      </ToggleGroup>
      <Separator className="rule" render={<hr />} />
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { mount }
