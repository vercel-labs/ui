import type { ProgressValueState } from "@ui-sdk/core/progress"
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@ui-sdk/vue"
import { createApp, defineComponent, h, ref, type PropType } from "vue"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { formats, progressSteps, valueLabels, type Variant } from "./variants"

const props = {
  variant: { type: Object as PropType<Variant>, required: true as const },
  env: { type: Object as PropType<Env>, required: true as const },
}

// The props every variant passes, with named formats and value labels resolved.
const rich = (variant: Variant) => ({
  ...variant.options,
  format: variant.format && formats[variant.format],
  getValueLabel: variant.valueLabel && valueLabels[variant.valueLabel],
})

const VariantProgress = defineComponent({
  props,
  setup({ variant, env }) {
    const value = ref(variant.options.value)
    if (variant.steps) {
      env.controls(
        progressSteps.map(([label, step]) => [
          label,
          () => {
            value.value = step(value.value)
            env.log(`value ${value.value}`)
          },
        ])
      )
    }
    return () =>
      h(
        Progress,
        { class: classes.root, ...rich(variant), value: value.value },
        () => [
          h(ProgressLabel, { class: classes.label }, () => variant.label),
          h(
            ProgressValue,
            { class: classes.value },
            variant.render
              ? {
                  default: ({ state }: { state: ProgressValueState }) =>
                    `${state.text || "…"} · ${state.status}`,
                }
              : undefined
          ),
          h(ProgressTrack, { class: classes.track }, () =>
            h(ProgressIndicator, { class: classes.progressIndicator })
          ),
        ]
      )
  },
})

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) =>
    createApp(VariantProgress, { variant, env }).mount(slot)
  )
}

export { mount }
