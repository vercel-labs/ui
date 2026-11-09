import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from "@ui-sdk/solid/meter"
import { render } from "@solidjs/web"
import { createSignal, omit, type ComponentProps } from "solid-js"
import { meterFixture } from "tests/fixtures/meter.ts"

const { storage, requests, disk, score } = meterFixture

function Gauge(props: ComponentProps<typeof Meter> & { label: string }) {
  const rest = omit(props, "label")
  return (
    <Meter class="gauge" {...rest}>
      <MeterLabel>{props.label}</MeterLabel>
      <MeterValue class="gauge-value" />
      <MeterTrack class="gauge-track">
        <MeterIndicator class="gauge-indicator" />
      </MeterTrack>
    </Meter>
  )
}

function Fixture() {
  const [value, setValue] = createSignal(storage.value)
  return (
    <div class="fixture">
      <button>Before</button>
      <Gauge label={storage.label} value={value()} />
      <Gauge
        label={requests.label}
        value={requests.value}
        max={requests.max}
        getValueLabel={requests.valueLabel}
      />
      <Gauge
        label={disk.label}
        value={disk.value}
        max={disk.max}
        format={disk.format}
      />
      <Gauge
        label={score.label}
        value={score.value}
        min={score.min}
        max={score.max}
      />
      <button onClick={() => setValue((current) => current + storage.step)}>
        Fill
      </button>
      <button onClick={() => setValue(storage.value)}>Reset</button>
      <button>After</button>
      <output role="status" aria-label="Last action" />
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
