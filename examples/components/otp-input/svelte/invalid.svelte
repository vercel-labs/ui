<script lang="ts">
  import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/svelte/otp-input"

</script>

<div data-slot="stack">
  <OTPInput
    defaultValue="000000"
    aria-label="Verification code"
    aria-invalid="true"
    aria-describedby="otp-error"
  >
    <OTPInputGroup>
      {#each { length: 6 } as _, index}
        <OTPInputSlot index={index} />
      {/each}
    </OTPInputGroup>
  </OTPInput>
  <p id="otp-error">That code didn't work. Check it and try again.</p>
</div>
