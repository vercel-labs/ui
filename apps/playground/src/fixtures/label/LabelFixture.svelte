<script lang="ts">
  import {
    Checkbox,
    Label,
    NumberInput,
    NumberInputControl,
    Radio,
    RadioGroup,
    Slider,
    SliderControl,
    SliderThumb,
    SliderTrack,
  } from "@ui-sdk/svelte"
  import { labelFixture } from "tests/fixtures/label.ts"

  const { email, plan, volume, terms, region, delivery, quantity } = labelFixture
  let shown = $state(false)
</script>

<div class="fixture">
  <button>Before</button>
  <Label for={email.id}>{email.label}</Label>
  <input id={email.id} />
  <Label for={plan.id}>{plan.label}</Label>
  <RadioGroup id={plan.id} class="radio-group" defaultValue={plan.defaultValue}>
    {#each plan.items as item (item.value)}
      <Radio class="radio" value={item.value}>{item.label}</Radio>
    {/each}
  </RadioGroup>
  <Label for={volume.id}>{volume.label}</Label>
  <Slider id={volume.id} class="slider" defaultValue={volume.defaultValue}>
    <SliderControl>
      <SliderTrack class="slider-track"><SliderThumb class="slider-thumb" /></SliderTrack>
    </SliderControl>
  </Slider>
  <Label><Checkbox class="checkbox" />{terms.label}</Label>
  <Label for={region.id}>{region.label}</Label>
  <RadioGroup id={region.id} class="radio-group" disabled>
    {#each region.items as item (item.value)}
      <Radio class="radio" value={item.value}>{item.label}</Radio>
    {/each}
  </RadioGroup>
  <Label for={delivery.id}>{delivery.label}</Label>
  <RadioGroup id={delivery.id} class="radio-group" aria-label={delivery.name}>
    {#each delivery.items as item (item.value)}
      <Radio class="radio" value={item.value}>{item.label}</Radio>
    {/each}
  </RadioGroup>
  <Label for={quantity.id}>{quantity.label}</Label>
  {#if shown}
    <NumberInput id={quantity.id} defaultValue={quantity.defaultValue}>
      <NumberInputControl />
    </NumberInput>
  {:else}
    <button onclick={() => (shown = true)}>{quantity.show}</button>
  {/if}
  <button>After</button>
</div>
