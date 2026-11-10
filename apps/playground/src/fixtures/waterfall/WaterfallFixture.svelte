<script lang="ts">
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
  } from "@ui-sdk/svelte/waterfall"
  import {
    describeWaterfall,
    flatWaterfall,
    waterfallFixture,
    waterfallOptions,
  } from "tests/fixtures/waterfall.ts"

  const controller = createWaterfallController()
  const spans = flatWaterfall(waterfallFixture.items)
  const { cancel, range: startRange, ...options } = waterfallOptions()

  let action = $state("")
  let range = $state(startRange)

  function onExpandedChange(
    expanded: string[],
    details: { cancel: () => void }
  ) {
    if (cancel && expanded.includes(cancel) && !controller.isExpanded(cancel)) {
      return details.cancel()
    }
    action = describeWaterfall("expanded", expanded)
  }
</script>

<div class="fixture">
  <button>Before</button>
  <Waterfall
    aria-label={waterfallFixture.label}
    items={waterfallFixture.items}
    {controller}
    {range}
    {...options}
    onValueChange={(value) => (action = describeWaterfall("selected", value))}
    {onExpandedChange}
  >
    <WaterfallHeaderRow>
      <WaterfallColumnHeader>Name</WaterfallColumnHeader>
      <WaterfallColumnHeader>Status</WaterfallColumnHeader>
      <WaterfallColumnHeader aria-label="Timeline">
        <WaterfallAxis />
        <WaterfallMark time={waterfallFixture.mark.time}>
          {waterfallFixture.mark.label}
        </WaterfallMark>
      </WaterfallColumnHeader>
    </WaterfallHeaderRow>
    {#each spans as span (span.value)}
      <WaterfallRow value={span.value}>
        <WaterfallRowHeader>
          {#if span.children}<WaterfallIndicator />{/if}
          {span.label}
        </WaterfallRowHeader>
        <WaterfallCell>{span.status}</WaterfallCell>
        <WaterfallBar />
      </WaterfallRow>
    {/each}
  </Waterfall>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <button onclick={() => controller.expandAll()}>Expand all</button>
  <button onclick={() => controller.collapseAll()}>Collapse all</button>
  <button onclick={() => controller.reveal("flags")}>Reveal flags</button>
  <button onclick={() => (range = [500, 1000])}>Zoom</button>
</div>
