<script lang="ts">
  import { Slider, SliderControl, SliderIndicator, SliderThumb, SliderTrack } from "@ui-sdk/svelte/slider"

  const channels = [
    { label: "Bass", value: 50 },
    { label: "Treble", value: 25 },
  ]
</script>

<div data-slot="row">
  {#each channels as channel (channel.label)}
    <Slider orientation="vertical" defaultValue={channel.value}>
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb aria-label={channel.label} />
        </SliderTrack>
      </SliderControl>
    </Slider>
  {/each}
</div>
