import {
  Meter,
  MeterIndicator,
  MeterTrack,
  MeterValue,
} from "@ui-sdk/react/meter"
import * as React from "react"
import { createRoot } from "react-dom/client"

// Parts rendered as other elements, and with functions of their state.
function Fixture() {
  const [value, setValue] = React.useState(40)
  return (
    <div className="fixture">
      <button>Before</button>
      <Meter
        value={value}
        aria-label="Memory"
        render={<section />}
        className={(state) =>
          `gauge ${state.percent >= 80 ? "is-high" : "is-ok"}`
        }
      >
        <MeterValue>{(state) => `${state.text} used`}</MeterValue>
        <MeterTrack className="gauge-track">
          <MeterIndicator className="gauge-indicator" />
        </MeterTrack>
      </Meter>
      <button onClick={() => setValue(90)}>Fill</button>
      <button>After</button>
      <output role="status" aria-label="Last action" />
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

export { Fixture, mount }
