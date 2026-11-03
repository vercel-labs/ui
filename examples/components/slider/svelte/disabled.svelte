<script lang="ts">
  import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack } from "@ui-sdk/svelte/slider"
</script>

<Slider defaultValue={50} disabled>
  <SliderControl>
    <SliderTrack>
      <SliderIndicator />
      <SliderThumb aria-label="Disabled" />
    </SliderTrack>
  </SliderControl>
</Slider>
