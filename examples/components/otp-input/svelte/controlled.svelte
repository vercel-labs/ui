<script lang="ts">
  import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/svelte/otp-input"

  let value = $state("")
</script>

<div data-slot="stack">
  <label for="one-time-password" data-slot="label"> One-time password </label>
  <OTPInput id="one-time-password" bind:value={value}>
    <OTPInputGroup>
      {#each { length: 6 } as _, index}
        <OTPInputSlot index={index} />
      {/each}
    </OTPInputGroup>
  </OTPInput>
  <p data-slot="output">{value ? `You entered: ${value}` : "Enter your one-time password."}</p>
</div>
