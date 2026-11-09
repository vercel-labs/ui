import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/react/field"
import { Radio, RadioGroup } from "@ui-sdk/react/radio"
import { Switch, SwitchThumb } from "@ui-sdk/react/switch"
import * as React from "react"
import { createRoot } from "react-dom/client"

function Fixture() {
  const [action, setAction] = React.useState("")
  const [nickname, setNickname] = React.useState("")
  return (
    <div className="fixture">
      <button>Before</button>
      <form
        className="form"
        aria-label="Rendering"
        onSubmit={(event) => event.preventDefault()}
      >
        <label>
          <Checkbox
            className="checkbox"
            render={<span />}
            onCheckedChange={(checked) => setAction(`span:${checked}`)}
          >
            <CheckboxIndicator className="checkbox-indicator" />
          </Checkbox>
          Rendered as a span
        </label>
        <Checkbox
          aria-label="Render function"
          render={(props, state) => (
            <button {...props}>{state.checked ? "On" : "Off"}</button>
          )}
        />
        <Checkbox
          aria-label="Class from state"
          className={(state) =>
            `checkbox ${state.checked ? "is-checked" : "is-unchecked"}`
          }
        />
        <label>
          <Switch className="switch" defaultChecked>
            <SwitchThumb
              render={(props, state) => (
                <span {...props}>{state.checked ? "I" : "O"}</span>
              )}
            />
          </Switch>
          Labelled thumb
        </label>
        <RadioGroup
          aria-label="Size"
          defaultValue="small"
          onValueChange={(value) => setAction(`size:${value}`)}
        >
          {["small", "large"].map((value) => (
            <label key={value}>
              <Radio className="radio" value={value} render={<span />} />
              {value === "small" ? "Small" : "Large"}
            </label>
          ))}
        </RadioGroup>
        <Field>
          <FieldLabel>Nickname</FieldLabel>
          <FieldControl
            value={nickname}
            onChange={(event) => setNickname(event.currentTarget.value)}
          />
        </Field>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Fixture />)
}

export { mount }
