import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { formats, progressSteps, valueLabels, type Variant } from "./variants"

type GaugeElement = HTMLElement & { format?: unknown; getValueLabel?: unknown }

// Options as attributes. A null value is left out, which is indeterminate.
function attributes(options: Variant["options"]) {
  return Object.entries(options)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([name, value]) => ` ${name}="${value}"`)
    .join("")
}

// Render functions are React and Vue only, so those variants show the formatted value here.
function markup(variant: Variant) {
  return `<ui-progress class="${classes.root}"${attributes(variant.options)}>
    <ui-progress-label class="${classes.label}">${variant.label}</ui-progress-label>
    <ui-progress-value class="${classes.value}"></ui-progress-value>
    <ui-progress-track class="${classes.track}"><ui-progress-indicator class="${classes.progressIndicator}"></ui-progress-indicator></ui-progress-track>
  </ui-progress>`
}

function controls(gauge: GaugeElement, variant: Variant, env: Env) {
  if (!variant.steps) {
    return
  }
  const read = () => gauge.getAttribute("value")
  const write = (value: number | null) =>
    value === null
      ? gauge.removeAttribute("value")
      : gauge.setAttribute("value", String(value))
  env.controls(
    progressSteps.map(([label, step]) => [
      label,
      () => {
        const current = read()
        const next = step(current === null ? null : Number(current))
        write(next)
        env.log(`value ${next}`)
      },
    ])
  )
}

async function mount(root: HTMLElement) {
  kitchenSink(root, "web", (slot, variant, env) => {
    slot.innerHTML = markup(variant)
    const gauge = slot.firstElementChild as GaugeElement
    // Rich options are properties, set here before the elements upgrade.
    if (variant.format) {
      gauge.format = formats[variant.format]
    }
    if (variant.valueLabel) {
      gauge.getValueLabel = valueLabels[variant.valueLabel]
    }
    controls(gauge, variant, env)
  })
  await import("@ui-sdk/web/progress")
}

export { mount }
