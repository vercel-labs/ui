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
} from "@ui-sdk/react/waterfall"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { flatWaterfall, waterfallFixture } from "tests/fixtures/waterfall.ts"
import { kitchenSink, type Env } from "./shell"
import { barLabels, formats, items, type Variant } from "./variants"

const spans = flatWaterfall(items)

function Columns() {
  return (
    <>
      <WaterfallHeaderRow>
        <WaterfallColumnHeader>Name</WaterfallColumnHeader>
        <WaterfallColumnHeader>Status</WaterfallColumnHeader>
        <WaterfallColumnHeader aria-label="Timeline">
          <WaterfallAxis maxTicks={4} />
          <WaterfallMark time={waterfallFixture.mark.time}>
            {waterfallFixture.mark.label}
          </WaterfallMark>
        </WaterfallColumnHeader>
      </WaterfallHeaderRow>
      {spans.map((span) => (
        <WaterfallRow key={span.value} value={span.value}>
          <WaterfallRowHeader>
            {span.children && <WaterfallIndicator />}
            {span.label}
          </WaterfallRowHeader>
          <WaterfallCell>{span.status}</WaterfallCell>
          <WaterfallBar />
        </WaterfallRow>
      ))}
    </>
  )
}

function VariantWaterfall({ variant, env }: { variant: Variant; env: Env }) {
  const [controller] = React.useState(createWaterfallController)
  React.useEffect(() => {
    if (variant.controller) {
      env.controls([
        ["expandAll()", () => controller.expandAll()],
        ["collapseAll()", () => controller.collapseAll()],
        ["reveal('flags')", () => controller.reveal("flags")],
      ])
    }
  }, [variant, env, controller])
  return (
    <Waterfall
      aria-label={waterfallFixture.label}
      items={items}
      controller={controller}
      range={variant.range}
      format={variant.format && formats[variant.format]}
      getBarLabel={variant.barLabel && barLabels[variant.barLabel]}
      {...variant.options}
      onValueChange={(value, details) =>
        env.log(`valueChange ${value} (${details.reason})`)
      }
      onExpandedChange={(expanded, details) =>
        env.log(`expandedChange [${expanded}] (${details.reason})`)
      }
    >
      {variant.columns ? <Columns /> : undefined}
    </Waterfall>
  )
}

function mount(root: HTMLElement) {
  kitchenSink(root, "react", (slot, variant, env) =>
    createRoot(slot).render(
      <React.StrictMode>
        <VariantWaterfall variant={variant} env={env} />
      </React.StrictMode>
    )
  )
}

export { mount }
