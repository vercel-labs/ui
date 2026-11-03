"use client"

import * as React from "react"
import { Switch, SwitchThumb } from "@ui-sdk/react/switch"

function Example() {
  const [submitted, setSubmitted] = React.useState("")

  return (
    <div data-slot="stack">
      <form
        data-slot="stack"
        id="email-preferences"
        onSubmit={(event) => {
          event.preventDefault()
          const data = [...new FormData(event.currentTarget)].map(([name, value]) => `${name}=${value}`)
          setSubmitted(data.join(", ") || "nothing")
        }}
        onReset={() => setSubmitted("")}
      >
        <fieldset data-slot="stack">
          <legend>Email notifications</legend>
          <label data-slot="label">
            Marketing emails
            <Switch name="marketing">
              <SwitchThumb />
            </Switch>
          </label>
          <label data-slot="label">
            Security alerts
            <Switch name="security" defaultChecked>
              <SwitchThumb />
            </Switch>
          </label>
          <label data-slot="label">
            Weekly digest
            <Switch name="digest" value="weekly" defaultChecked>
              <SwitchThumb />
            </Switch>
          </label>
        </fieldset>
        <div data-slot="row">
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <div>
        <label data-slot="label">
          Join the beta
          <Switch name="beta" form="email-preferences">
            <SwitchThumb />
          </Switch>
        </label>
      </div>
      <output data-slot="output">{submitted ? `Submitted: ${submitted}` : ""}</output>
    </div>
  )
}

export { Example }
