<script lang="ts">
  import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack } from "@ui-sdk/svelte/slider"

  const thumbs = ["Low", "Medium", "High"]
</script>

<Slider defaultValue={[10, 20, 70]} step={10}>
  <SliderControl>
    <SliderTrack>
      <SliderIndicator />
      {#each thumbs as label, index (label)}
        <SliderThumb {index} aria-label={label} />
      {/each}
    </SliderTrack>
  </SliderControl>
</Slider>
