<script lang="ts">
  import {
    Slider,
    SliderControl,
    SliderIndicator,
    SliderThumb,
    SliderTrack,
  } from "@ui-sdk/svelte"
  import { perfSize } from "tests/fixtures/perf.ts"

  // N single-thumb sliders, like a page of settings. Each submits a value, so each renders its form input.
  const sliders = Array.from({ length: perfSize(200) }, (_, index) => index)
</script>

<div class="fixture" style="flex-direction: column; align-items: start">
  <button>Before</button>
  {#each sliders as index (index)}
    <Slider
      class="slider-row"
      name={`slider-${index}`}
      defaultValue={index % 101}
    >
      <SliderControl class="slider-control">
        <SliderTrack class="slider-track">
          <SliderIndicator class="slider-indicator" />
          <SliderThumb
            class="slider-thumb"
            aria-label={`Slider ${index + 1}`}
          />
        </SliderTrack>
      </SliderControl>
    </Slider>
  {/each}
  <button>After</button>
</div>
