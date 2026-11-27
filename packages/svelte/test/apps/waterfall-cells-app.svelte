<script lang="ts">
  import {
    Waterfall,
    WaterfallBar,
    WaterfallCell,
    WaterfallRow,
    WaterfallRowHeader,
  } from "../../src/waterfall"

  const items = [
    { value: "doc", label: "/", start: 0, duration: 100 },
    { value: "css", label: "app.css", start: 50, duration: 80 },
  ]
</script>

<Waterfall aria-label="Requests" {items}>
  {#each items as span (span.value)}
    <WaterfallRow value={span.value}>
      <WaterfallRowHeader>{span.label}</WaterfallRowHeader>
      <WaterfallCell>html</WaterfallCell>
      <WaterfallCell id={`${span.value}-size`}>14 kB</WaterfallCell>
      <WaterfallBar />
    </WaterfallRow>
  {/each}
</Waterfall>
