<script lang="ts">
  import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack } from "@ui-sdk/svelte/slider"
</script>

<Slider defaultValue={75}>
  <SliderControl>
    <SliderTrack>
      <SliderIndicator />
      <SliderThumb aria-label="Volume" />
    </SliderTrack>
  </SliderControl>
</Slider>
