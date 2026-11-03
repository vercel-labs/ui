<script lang="ts">
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"
  import {
    Slider,
    SliderControl,
    SliderIndicator,
    SliderThumb,
    SliderTrack,
    SliderValue,
    type SliderValueCommitDetails,
  } from "@ui-sdk/svelte/slider"

  const save = () => new Promise((resolve) => setTimeout(resolve, 600))

  let changes = $state(0)
  let status = $state("Drag to change the brightness.")

  async function onCommit(value: number | number[], details: SliderValueCommitDetails) {
    status = "Saving…"
    await save()
    status = `Saved ${value} (${details.reason}).`
  }
</script>

<Field>
  <Slider defaultValue={50} onValueChange={() => changes++} onValueCommit={onCommit}>
    <div data-slot="row">
      <FieldLabel>Brightness</FieldLabel>
      <SliderValue />
    </div>
    <SliderControl>
      <SliderTrack>
        <SliderIndicator />
        <SliderThumb />
      </SliderTrack>
    </SliderControl>
  </Slider>
  <output data-slot="output">
    <span>Changes: {changes}</span>
    <span>{status}</span>
  </output>
</Field>
