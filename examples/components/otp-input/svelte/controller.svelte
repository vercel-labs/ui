<script lang="ts">
  import { createOTPInputController, OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/svelte/otp-input"

  const code = createOTPInputController()
  let reading = $state("")
  const read = () => (reading = `The code is "${code.getValue()}".`)
</script>

<div data-slot="stack">
  <OTPInput controller={code} aria-label="Verification code">
    <OTPInputGroup>
      {#each { length: 6 } as _, index}
        <OTPInputSlot index={index} />
      {/each}
    </OTPInputGroup>
  </OTPInput>
  <div data-slot="row">
    <button type="button" onclick={() => (code.setValue('123456'))}>Fill</button>
    <button type="button" onclick={() => (code.clear())}>Clear</button>
    <button type="button" onclick={read}>Read</button>
    <button type="button" onclick={() => (code.focus())}>Focus</button>
  </div>
  <output data-slot="output">{reading}</output>
</div>
