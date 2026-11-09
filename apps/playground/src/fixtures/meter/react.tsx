import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from "@ui-sdk/react/meter"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { meterFixture } from "tests/fixtures/meter.ts"

const { storage, requests, disk, score } = meterFixture

function Gauge({
  label,
  ...props
}: React.ComponentProps<typeof Meter> & { label: string }) {
  return (
    <Meter className="gauge" {...props}>
      <MeterLabel>{label}</MeterLabel>
      <MeterValue className="gauge-value" />
      <MeterTrack className="gauge-track">
        <MeterIndicator className="gauge-indicator" />
      </MeterTrack>
    </Meter>
  )
}

function Fixture() {
  const [value, setValue] = React.useState(storage.value)
  return (
    <div className="fixture">
      <button>Before</button>
      <Gauge label={storage.label} value={value} />
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
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { Fixture, mount }
