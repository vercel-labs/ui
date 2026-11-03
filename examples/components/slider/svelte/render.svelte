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

<Slider defaultValue={60} aria-label="Brightness">
  <SliderValue>
    {#snippet children(state)}Brightness {state.text}%{/snippet}
  </SliderValue>
  <SliderControl>
    <SliderTrack>
      <SliderIndicator />
      <SliderThumb aria-label="Brightness">
        {#snippet render({ props, state, children })}
          <span {...props}>
            <span data-slot="output">{state.thumbValue}</span>
            {@render children?.(state)}
          </span>
        {/snippet}
      </SliderThumb>
    </SliderTrack>
  </SliderControl>
</Slider>
