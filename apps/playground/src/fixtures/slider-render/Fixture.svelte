<script lang="ts">
  import {
    NumberInput,
    NumberInputControl,
    NumberInputIncrement,
    Slider,
    SliderControl,
    SliderIndicator,
    SliderThumb,
    SliderTrack,
    SliderValue,
  } from "@ui-sdk/svelte"

  // Parts rendered as other elements, and from their state. One fixture covers
  // Slider and Number Input.
  let action = $state("")
</script>

<div class="fixture">
  <button>Before</button>
  <Slider
    defaultValue={40}
    onValueChange={(value) => (action = `brightness:${value}`)}
  >
    <SliderValue class="slider-value">
      {#snippet children(state)}Brightness {state.text}{/snippet}
    </SliderValue>
    <SliderControl class="slider-control">
      <SliderTrack class="slider-track">
        <SliderIndicator class="slider-indicator" />
        <SliderThumb class="slider-thumb" aria-label="Brightness">
          {#snippet render({ props, state, children })}
            <span {...props}>
              <span class="thumb-label">{state.thumbValue}</span>
              {@render children?.(state)}
            </span>
          {/snippet}
        </SliderThumb>
      </SliderTrack>
    </SliderControl>
  </Slider>
  <NumberInput defaultValue={8} max={9}>
    <NumberInputControl aria-label="Count" />
    <NumberInputIncrement aria-label="Increase count">
      {#snippet children(state)}{state.disabled ? "At most" : "More"}{/snippet}
    </NumberInputIncrement>
  </NumberInput>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
