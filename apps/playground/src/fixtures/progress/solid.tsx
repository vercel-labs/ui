import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@ui-sdk/solid/progress"
import { render } from "@solidjs/web"
import { createSignal, omit, type ComponentProps } from "solid-js"
import { progressFixture } from "tests/fixtures/progress.ts"

const { upload, loading, files, disk } = progressFixture

function Bar(props: ComponentProps<typeof Progress> & { label: string }) {
  const rest = omit(props, "label")
  return (
    <Progress class="gauge" {...rest}>
      <ProgressLabel>{props.label}</ProgressLabel>
      <ProgressValue class="gauge-value" />
      <ProgressTrack class="gauge-track">
        <ProgressIndicator class="gauge-indicator" />
      </ProgressTrack>
    </Progress>
  )
}

function Fixture() {
  const [value, setValue] = createSignal(upload.value)
  return (
    <div class="fixture">
      <button>Before</button>
      <Bar label={upload.label} value={value()} />
      <Bar label={loading.label} value={null} />
      <Bar
        label={files.label}
        value={files.value}
        max={files.max}
        getValueLabel={(value) => files.valueLabel(value!)}
      />
      <Bar
        label={disk.label}
        value={disk.value}
        max={disk.max}
        format={disk.format}
      />
      <button
        onClick={() =>
          setValue((current) => Math.min(100, current + upload.step))
        }
      >
        Advance
      </button>
      <button onClick={() => setValue(upload.value)}>Restart</button>
      <button>After</button>
      <output role="status" aria-label="Last action" />
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
