<script lang="ts">
  import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/svelte/otp-input"

</script>

<OTPInput maxLength={4} textAlign="center" aria-label="PIN">
  <OTPInputGroup>
    {#each { length: 4 } as _, index}
      <OTPInputSlot index={index} />
    {/each}
  </OTPInputGroup>
</OTPInput>
