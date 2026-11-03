<script lang="ts">
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"
  import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack } from "@ui-sdk/svelte/slider"

  let value = $state<number | number[]>([0.3, 0.7])
  let reason = $state("")

  function reset() {
    value = [0.3, 0.7]
    reason = ""
  }
</script>

<Field>
  <div data-slot="row">
    <FieldLabel>Temperature</FieldLabel>
    <span data-slot="output">{[value].flat().join(", ")}</span>
  </div>
  <Slider
    bind:value
    min={0}
    max={1}
    step={0.1}
    onValueChange={(_value, details) => (reason = details.reason)}
  >
    <SliderControl>
      <SliderTrack>
        <SliderIndicator />
        <SliderThumb index={0} aria-label="Minimum temperature" />
        <SliderThumb index={1} aria-label="Maximum temperature" />
      </SliderTrack>
    </SliderControl>
  </Slider>
  <div data-slot="row">
    <button type="button" onclick={reset}>
      Reset
    </button>
  </div>
  <output data-slot="output">{reason ? `Last change: ${reason}` : "Drag a thumb."}</output>
</Field>
