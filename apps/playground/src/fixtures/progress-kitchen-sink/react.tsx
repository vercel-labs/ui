import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@ui-sdk/react/progress"
import * as React from "react"
import { createRoot } from "react-dom/client"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { formats, progressSteps, valueLabels, type Variant } from "./variants"

// The props every variant passes, with named formats and value labels resolved.
const rich = (variant: Variant) => ({
  format: variant.format && formats[variant.format],
  getValueLabel: variant.valueLabel && valueLabels[variant.valueLabel],
})

function VariantProgress({ variant, env }: { variant: Variant; env: Env }) {
  const [value, setValue] = React.useState(variant.options.value)
  // Only the step buttons change the value, so they keep the latest one here.
  const latest = React.useRef(value)
  React.useEffect(() => {
    if (!variant.steps) {
      return
    }
    env.controls(
      progressSteps.map(([label, step]) => [
        label,
        () => {
          latest.current = step(latest.current)
          setValue(latest.current)
          env.log(`value ${latest.current}`)
        },
      ])
    )
  }, [variant, env])
  return (
    <Progress
      className={classes.root}
      {...variant.options}
      {...rich(variant)}
      value={value}
    >
      <ProgressLabel className={classes.label}>{variant.label}</ProgressLabel>
      <ProgressValue className={classes.value}>
        {variant.render
          ? (state) => `${state.text || "…"} · ${state.status}`
          : undefined}
      </ProgressValue>
      <ProgressTrack className={classes.track}>
        <ProgressIndicator className={classes.progressIndicator} />
      </ProgressTrack>
    </Progress>
  )
}

function mount(root: HTMLElement) {
  kitchenSink(root, "react", (slot, variant, env) =>
    createRoot(slot).render(
      <React.StrictMode>
        <VariantProgress variant={variant} env={env} />
      </React.StrictMode>
    )
  )
}

export { mount }
