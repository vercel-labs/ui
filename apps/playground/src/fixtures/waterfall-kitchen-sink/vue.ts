import {
  createWaterfallController,
  Waterfall,
  WaterfallAxis,
  WaterfallBar,
  WaterfallCell,
  WaterfallColumnHeader,
  WaterfallHeaderRow,
  WaterfallIndicator,
  WaterfallMark,
  WaterfallRow,
  WaterfallRowHeader,
} from "@ui-sdk/vue"
import { flatWaterfall, waterfallFixture } from "tests/fixtures/waterfall.ts"
import { createApp, defineComponent, h, type PropType } from "vue"
import { kitchenSink, type Env } from "./shell"
import { barLabels, formats, items, type Variant } from "./variants"

const spans = flatWaterfall(items)

const props = {
  variant: { type: Object as PropType<Variant>, required: true as const },
  env: { type: Object as PropType<Env>, required: true as const },
}

const columns = () => [
  h(WaterfallHeaderRow, null, () => [
    h(WaterfallColumnHeader, null, () => "Name"),
    h(WaterfallColumnHeader, null, () => "Status"),
    h(WaterfallColumnHeader, { "aria-label": "Timeline" }, () => [
      h(WaterfallAxis, { maxTicks: 4 }),
      h(
        WaterfallMark,
        { time: waterfallFixture.mark.time },
        () => waterfallFixture.mark.label
      ),
    ]),
  ]),
  ...spans.map((span) =>
    h(WaterfallRow, { key: span.value, value: span.value }, () => [
      h(WaterfallRowHeader, null, () => [
        span.children ? h(WaterfallIndicator) : null,
        span.label,
      ]),
      h(WaterfallCell, null, () => span.status),
      h(WaterfallBar),
    ])
  ),
]

const VariantWaterfall = defineComponent({
  props,
  setup({ variant, env }) {
    const controller = createWaterfallController()
    if (variant.controller) {
      env.controls([
        ["expandAll()", () => controller.expandAll()],
        ["collapseAll()", () => controller.collapseAll()],
        ["reveal('flags')", () => controller.reveal("flags")],
      ])
    }
    return () =>
      h(
        Waterfall,
        {
          "aria-label": waterfallFixture.label,
          items,
          controller,
          range: variant.range,
          format: variant.format && formats[variant.format],
          getBarLabel: variant.barLabel && barLabels[variant.barLabel],
          ...variant.options,
          onValueChange: (value: string | null, details: { reason: string }) =>
            env.log(`valueChange ${value} (${details.reason})`),
          onExpandedChange: (expanded: string[], details: { reason: string }) =>
            env.log(`expandedChange [${expanded}] (${details.reason})`),
        },
        variant.columns ? columns : undefined
      )
  },
})

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) =>
    createApp(VariantWaterfall, { variant, env }).mount(slot)
  )
}

export { mount }
