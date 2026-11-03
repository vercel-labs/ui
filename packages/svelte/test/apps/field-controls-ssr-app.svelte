<script lang="ts">
  import { Field, FieldLabel } from "../../src/field"
  import {
    NumberInput,
    NumberInputControl,
    NumberInputDecrement,
    NumberInputIncrement,
  } from "../../src/number-input"
  import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "../../src/password-input"
  import { Slider, SliderControl, SliderThumb, SliderTrack, SliderValue } from "../../src/slider"

  let { kind }: { kind: "number-input" | "password-input" | "slider" } = $props()
</script>

<Field>
  <FieldLabel>Amount</FieldLabel>
  {#if kind === "number-input"}
    <NumberInput>
      <NumberInputDecrement />
      <NumberInputControl />
      <NumberInputIncrement />
    </NumberInput>
  {:else if kind === "password-input"}
    <PasswordInput>
      <PasswordInputControl />
      <PasswordInputToggle />
    </PasswordInput>
  {:else}
    <Slider>
      <SliderControl>
        <SliderTrack><SliderThumb /></SliderTrack>
      </SliderControl>
      <SliderValue />
    </Slider>
  {/if}
</Field>
