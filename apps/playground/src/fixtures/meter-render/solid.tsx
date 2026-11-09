import {
  Meter,
  MeterIndicator,
  MeterTrack,
  MeterValue,
} from "@ui-sdk/solid/meter"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"

// Parts rendered as other elements, and with functions of their state.
function Fixture() {
  const [value, setValue] = createSignal(40)
  return (
    <div class="fixture">
      <button>Before</button>
      <Meter
        value={value()}
        aria-label="Memory"
        render={(props) => <section {...props} />}
        class={(state) => `gauge ${state.percent >= 80 ? "is-high" : "is-ok"}`}
      >
        <MeterValue>{(state) => `${state.text} used`}</MeterValue>
        <MeterTrack class="gauge-track">
          <MeterIndicator class="gauge-indicator" />
        </MeterTrack>
      </Meter>
      <button onClick={() => setValue(90)}>Fill</button>
      <button>After</button>
      <output role="status" aria-label="Last action" />
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
