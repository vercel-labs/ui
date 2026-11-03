<script lang="ts">
  import {
    Slider,
    SliderControl,
    SliderIndicator,
    SliderThumb,
    SliderTrack,
    SliderValue,
  } from "@ui-sdk/svelte/slider"
</script>

<div data-slot="stack">
  <Slider defaultValue={2010} min={1990} max={2030} step={5} format={{ useGrouping: false }}>
    <div data-slot="row">
      <span data-slot="label">Year</span>
      <SliderValue />
    </div>
    <SliderControl>
      <SliderTrack>
        <SliderIndicator />
        <SliderThumb aria-label="Year" />
      </SliderTrack>
    </SliderControl>
  </Slider>
  <Slider defaultValue={0.5} min={0} max={1} step={0.05}>
    <div data-slot="row">
      <span data-slot="label">Opacity</span>
      <SliderValue />
    </div>
    <SliderControl>
      <SliderTrack>
        <SliderIndicator />
        <SliderThumb aria-label="Opacity" />
      </SliderTrack>
    </SliderControl>
  </Slider>
</div>
