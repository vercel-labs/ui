<script lang="ts">
  import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/svelte/otp-input"

</script>

<OTPInput maxLength={6} pattern={/[0-9A-F]/i} inputMode="text" aria-label="Device code">
  <OTPInputGroup>
    {#each { length: 6 } as _, index}
      <OTPInputSlot index={index} />
    {/each}
  </OTPInputGroup>
</OTPInput>
