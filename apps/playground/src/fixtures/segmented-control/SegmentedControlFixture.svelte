<script lang="ts">
  import {
    createSegmentedControlController,
    SegmentedControl,
    SegmentedControlIndicator,
    SegmentedControlItem,
  } from "@ui-sdk/svelte"
  import { segmentedControlOptions } from "tests/fixtures/page.ts"
  import { segmentedControlFixture } from "tests/fixtures/segmented-control.ts"

  const controller = createSegmentedControlController()
  const { cancel, ...options } = segmentedControlOptions()

  let action = $state("")
  let submitted = $state("")

  function onValueChange(value: string | null, details: { reason: string; cancel: () => void }) {
    if (value === cancel) return details.cancel()
    action = `${value}:${details.reason}`
  }

  function onsubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault()
    submitted = Array.from(new FormData(event.currentTarget), ([key, value]) => `${key}=${value}`).join("&")
  }
</script>

<form class="fixture" {onsubmit}>
  <button type="button">Before</button>
  <SegmentedControl
    aria-label={segmentedControlFixture.label}
    name={segmentedControlFixture.name}
    {...options}
    {controller}
    {onValueChange}
  >
    <SegmentedControlIndicator />
    {#each segmentedControlFixture.items as item (item.value)}
      <SegmentedControlItem value={item.value} disabled={item.disabled}>{item.label}</SegmentedControlItem>
    {/each}
  </SegmentedControl>
  <button type="button">After</button>
  <button type="submit">Save</button>
  <button type="reset">Reset</button>
  <button type="button" onclick={() => controller.setValue("calendar")}>Show calendar</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output aria-label="Submitted">{submitted}</output>
</form>
