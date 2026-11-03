<script lang="ts">
  import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/svelte/otp-input"

  let status = $state("")
</script>

<div data-slot="stack">
  <OTPInput
    aria-label="Verification code"
    onValueChange={() => (status = '')}
    onComplete={(value, details) => (status = `Checking ${value}, from ${details.reason}.`)}
  >
    <OTPInputGroup>
      {#each { length: 6 } as _, index}
        <OTPInputSlot index={index} />
      {/each}
    </OTPInputGroup>
  </OTPInput>
  <output data-slot="output">{status}</output>
</div>
