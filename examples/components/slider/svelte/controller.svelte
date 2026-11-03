<script lang="ts">
  import {
    createSliderController,
    Slider,
    SliderControl,
    SliderIndicator,
    SliderThumb,
    SliderTrack,
    SliderValue,
  } from "@ui-sdk/svelte/slider"
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"

  const volume = createSliderController<number>()
  let reading = $state("")
</script>

<div data-slot="stack">
  <Field>
    <Slider defaultValue={40} controller={volume}>
      <div data-slot="row">
        <FieldLabel>Volume</FieldLabel>
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
    <button type="button" onclick={() => volume.setValue(0)}>
      Mute
    </button>
    <button type="button" onclick={() => volume.setValue(volume.getValue() + 10)}>
      Louder
    </button>
    <button type="button" onclick={() => (reading = `Volume is ${volume.getValue()}.`)}>
      Read
    </button>
    <button type="button" onclick={() => volume.focus()}>
      Focus
    </button>
  </div>
  {#if reading}
    <output data-slot="output">{reading}</output>
  {/if}
</div>
