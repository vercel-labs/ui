<script lang="ts">
  import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/svelte/hover-card"

  const timings = [
    { label: "Instant", delay: 0, closeDelay: 0 },
    { label: "Default", delay: 600, closeDelay: 300 },
    { label: "Patient", delay: 1200, closeDelay: 600 },
  ]
  let enabled = $state(true)
  const hrefOf = (label: string) => `https://example.com/${label.toLowerCase()}`
</script>

<div data-slot="stack">
  <div data-slot="row">
    {#each timings as timing (timing.label)}
      <HoverCard delay={timing.delay} closeDelay={timing.closeDelay} disabled={!enabled}>
        <HoverCardTrigger href={hrefOf(timing.label)}>{timing.label}</HoverCardTrigger>
        <HoverCardContent>
          <p>{timing.label}</p>
          <p data-slot="hint">
            Opens after {timing.delay}ms and closes {timing.closeDelay}ms after the pointer leaves.
          </p>
        </HoverCardContent>
      </HoverCard>
    {/each}
  </div>
  <label data-slot="label">
    <input bind:checked={enabled} type="checkbox" />
    Show cards
  </label>
</div>
