<script lang="ts">
  import { createRatingController, Rating, RatingItem } from "@ui-sdk/svelte"
  import { ratingOptions } from "tests/fixtures/page.ts"
  import { ratingFixture } from "tests/fixtures/rating.ts"

  const { quality, value, average } = ratingFixture
  const controller = createRatingController()
  const { cancel, disabled } = ratingOptions()

  let action = $state("")
  let submitted = $state("")

  function onValueChange(
    score: number | null,
    details: { reason: string; cancel: () => void }
  ) {
    if (score === cancel) {
      return details.cancel()
    }
    action = `${score}:${details.reason}`
  }

  function onsubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault()
    submitted = Array.from(
      new FormData(event.currentTarget),
      ([key, entry]) => `${key}=${entry}`
    ).join("&")
  }
</script>

<form class="fixture" {onsubmit}>
  <button type="button">Before</button>
  <Rating
    aria-label={quality.label}
    name={quality.name}
    defaultValue={quality.defaultValue}
    {disabled}
    {controller}
    {onValueChange}
  >
    <RatingItem>
      {#snippet children(state)}
        <span class="star">{state.fill}</span>
      {/snippet}
    </RatingItem>
  </Rating>
  <button type="button">After</button>
  <Rating
    aria-label={value.label}
    name={value.name}
    step={value.step}
    deselectable
  />
  <Rating
    value={average.value}
    getValueLabel={average.getValueLabel}
    readOnly
  />
  <button type="submit">Save</button>
  <button type="reset">Reset</button>
  <button type="button" onclick={() => controller.setValue(5)}>Rate five</button
  >
  <output role="status" aria-label="Last action">{action}</output>
  <output aria-label="Submitted">{submitted}</output>
</form>
