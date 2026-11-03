<script lang="ts">
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"
  import {
    Slider,
    SliderControl,
    SliderIndicator,
    SliderThumb,
    SliderTrack,
    SliderValue,
  } from "@ui-sdk/svelte/slider"

  const formId = $props.id()
  let submitted = $state("")

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    const data = [...new FormData(event.currentTarget as HTMLFormElement)].map(
      ([name, value]) => `${name}=${value}`,
    )
    submitted = data.join(", ")
  }
</script>

<div data-slot="stack">
  <form id={formId} data-slot="stack" onsubmit={onSubmit} onreset={() => (submitted = "")}>
    <Field>
      <Slider name="price" defaultValue={[200, 800]} max={1000} step={10}>
        <div data-slot="row">
          <FieldLabel>Price</FieldLabel>
          <SliderValue />
        </div>
        <SliderControl>
          <SliderTrack>
            <SliderIndicator />
            <SliderThumb index={0} aria-label="Minimum price" />
            <SliderThumb index={1} aria-label="Maximum price" />
          </SliderTrack>
        </SliderControl>
      </Slider>
    </Field>
    <Field>
      <Slider name="rating" defaultValue={3} min={1} max={5}>
        <div data-slot="row">
          <FieldLabel>Minimum rating</FieldLabel>
          <SliderValue />
        </div>
        <SliderControl>
          <SliderTrack>
            <SliderIndicator />
            <SliderThumb />
          </SliderTrack>
        </SliderControl>
      </Slider>
    </Field>
    <div data-slot="row">
      <button type="submit">
        Save
      </button>
      <button type="reset">
        Reset
      </button>
    </div>
  </form>
  <Field>
    <Slider
      name="distance"
      form={formId}
      defaultValue={25}
      max={100}
      step={5}
      format={{ style: "unit", unit: "kilometer" }}
    >
      <div data-slot="row">
        <FieldLabel>Distance</FieldLabel>
        <SliderValue />
      </div>
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb />
        </SliderTrack>
      </SliderControl>
    </Slider>
  </Field>
  {#if submitted}
    <output data-slot="output">Submitted: {submitted}</output>
  {/if}
</div>
