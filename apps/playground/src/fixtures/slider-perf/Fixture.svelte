<script lang="ts">
  import {
    Slider,
    SliderControl,
    SliderIndicator,
    SliderThumb,
    SliderTrack,
  } from "@ui-sdk/svelte"
  import { countRender, perfSize, perfThumbs } from "tests/fixtures/perf.ts"

  // A slider with N thumbs for the counts specs. Every other
  // thumb reads its value in its content, so specs can tell plain thumbs'
  // updates from watched ones. The last thumb is a watched one. A thumb's
  // render snippet would replace its range input, so thumbs count in their
  // children snippet: a watched one re-runs when the value it read changes,
  // and a plain one never does. The indicator counts in its render snippet,
  // whose text reads the props, so it re-runs when its attributes change.
  const values = perfThumbs(perfSize())
  const count = (
    kind: "watched" | "plain" | "indicator",
    ...reads: unknown[]
  ) => (countRender(kind), "")
</script>

<div class="fixture">
  <button>Before</button>
  <Slider defaultValue={values} max={1000}>
    <SliderControl class="slider-control is-wide">
      <SliderTrack class="slider-track">
        <SliderIndicator class="slider-indicator">
          {#snippet render({ props })}
            <div {...props}>{count("indicator", props)}</div>
          {/snippet}
        </SliderIndicator>
        {#each values as _, index (index)}
          {#if index % 2}
            <SliderThumb
              {index}
              class="slider-thumb"
              aria-label={`Thumb ${index + 1}`}
            >
              {#snippet children(state)}
                <span data-value={state.thumbValue}
                  >{count("watched", state.thumbValue)}</span
                >
              {/snippet}
            </SliderThumb>
          {:else}
            <SliderThumb
              {index}
              class="slider-thumb"
              aria-label={`Thumb ${index + 1}`}
            >
              {count("plain")}
            </SliderThumb>
          {/if}
        {/each}
      </SliderTrack>
    </SliderControl>
  </Slider>
  <button>After</button>
</div>
