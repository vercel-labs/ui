<script lang="ts">
  import {
    Field,
    FieldDescription,
    FieldLabel,
    Slider,
    SliderControl,
    SliderIndicator,
    SliderThumb,
    SliderTrack,
    SliderValue,
  } from "@ui-sdk/svelte"
  import {
    serialize,
    sliderFixture as f,
    sliderOptions,
  } from "tests/fixtures/slider.ts"

  const options = sliderOptions()
  let action = $state("")
  let commits = $state<string[]>([])
  let submitted = $state("")
  let volume = $state<number | number[]>(options.volume)
  const shared = {
    orientation: options.orientation,
    disabled: options.disabled,
    largeStep: options.largeStep,
    locale: options.locale,
  }

  // Records a change, or cancels it when the URL asks.
  function report(
    name: string,
    value: number | number[],
    details: { cancel: () => void }
  ) {
    if (options.cancel === name) {
      return details.cancel()
    }
    action = `${name}:${String(value)}`
  }

  function commit(name: string, value: number | number[]) {
    commits = [...commits, `${name}:${String(value)}`]
  }

  function onVolume(
    value: number | number[],
    details: { cancel: () => void; canceled: boolean }
  ) {
    report(f.volume.name, value, details)
    if (!details.canceled) {
      volume = value
    }
  }

  function onPrice(value: number | number[], details: { cancel: () => void }) {
    report(f.price.name, value, details)
  }

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    submitted = serialize(event.currentTarget as HTMLFormElement)
  }
</script>

<div class="fixture">
  <button>Before</button>
  <form class="form" aria-label={f.formLabel} onsubmit={onSubmit}>
    <Field>
      <FieldLabel>{f.volume.label}</FieldLabel>
      <Slider
        {...shared}
        name={f.volume.name}
        format={options.volumeFormat}
        value={options.controlled ? volume : undefined}
        defaultValue={options.controlled ? undefined : options.volume}
        onValueChange={onVolume}
        onValueCommit={(value) => commit(f.volume.name, value)}
      >
        <SliderValue class="slider-value" />
        <SliderControl class="slider-control">
          <SliderTrack class="slider-track">
            <SliderIndicator class="slider-indicator" />
            <SliderThumb class="slider-thumb" />
          </SliderTrack>
        </SliderControl>
      </Slider>
      <FieldDescription>{f.volume.description}</FieldDescription>
    </Field>

    <Field>
      <FieldLabel>{f.price.label}</FieldLabel>
      <Slider
        {...shared}
        name={f.price.name}
        defaultValue={options.price}
        minStepsBetweenThumbs={options.minSteps}
        format={options.format}
        onValueChange={onPrice}
        onValueCommit={(value) => commit(f.price.name, value)}
      >
        <SliderValue class="slider-value" />
        <SliderControl class="slider-control">
          <SliderTrack class="slider-track">
            <SliderIndicator class="slider-indicator" />
            {#each f.price.thumbs as label, index (label)}
              <SliderThumb {index} class="slider-thumb" aria-label={label} />
            {/each}
          </SliderTrack>
        </SliderControl>
      </Slider>
    </Field>

    <div class="row">
      <button type="submit">Save</button>
      <button type="reset">Reset</button>
    </div>
  </form>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output role="status" aria-label="Committed">{commits.join(" ")}</output>
  <output role="status" aria-label="Submitted">{submitted}</output>
</div>
