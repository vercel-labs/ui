<script lang="ts">
  import {
    ColorPicker,
    ColorPickerArea,
    ColorPickerAreaCanvas,
    ColorPickerAreaThumb,
    ColorPickerChannelInput,
    ColorPickerEyeDropper,
    ColorPickerInput,
    ColorPickerSlider,
    ColorPickerSliderThumb,
    ColorPickerSwatch,
    ColorPickerSwatches,
    ColorPickerSwatchItem,
    createColorPickerController,
  } from "@ui-sdk/svelte"
  import { colorPickerOptions } from "tests/fixtures/page.ts"
  import { colorPickerFixture } from "tests/fixtures/color-picker.ts"

  const controller = createColorPickerController()
  const { cancel, ...options } = colorPickerOptions()

  let action = $state("")
  let committed = $state("")
  let submitted = $state("")

  function onValueChange(
    value: string,
    details: { reason: string; cancel: () => void }
  ) {
    if (cancel) {
      return details.cancel()
    }
    action = `${value}:${details.reason}`
  }

  function onValueCommit(value: string, details: { reason: string }) {
    committed = `${value}:${details.reason}`
  }

  function onsubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault()
    submitted = Array.from(
      new FormData(event.currentTarget),
      ([key, value]) => `${key}=${value}`
    ).join("&")
  }
</script>

<form class="fixture" {onsubmit}>
  <button type="button">Before</button>
  <ColorPicker
    aria-label={colorPickerFixture.label}
    name={colorPickerFixture.name}
    {...options}
    {controller}
    {onValueChange}
    {onValueCommit}
  >
    <ColorPickerArea>
      {#if options.space === "oklch"}
        <ColorPickerAreaCanvas />
      {/if}
      <ColorPickerAreaThumb />
    </ColorPickerArea>
    <ColorPickerSlider channel="hue">
      <ColorPickerSliderThumb />
    </ColorPickerSlider>
    <ColorPickerSlider channel="alpha">
      <ColorPickerSliderThumb />
    </ColorPickerSlider>
    <ColorPickerInput aria-label={colorPickerFixture.inputLabel} />
    <ColorPickerChannelInput channel="alpha" />
    <ColorPickerSwatch />
    <ColorPickerEyeDropper>Pick from screen</ColorPickerEyeDropper>
    <ColorPickerSwatches aria-label="Presets">
      {#each colorPickerFixture.swatches as swatch (swatch)}
        <ColorPickerSwatchItem value={swatch} />
      {/each}
    </ColorPickerSwatches>
  </ColorPicker>
  <button type="button">After</button>
  <button type="submit">Save</button>
  <button type="reset">Reset</button>
  <button type="button" onclick={() => controller.setValue("rebeccapurple")}
    >Use purple</button
  >
  <output role="status" aria-label="Last action">{action}</output>
  <output aria-label="Committed">{committed}</output>
  <output aria-label="Submitted">{submitted}</output>
</form>
