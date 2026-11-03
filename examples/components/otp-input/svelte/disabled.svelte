<script lang="ts">
  import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/svelte/otp-input"

</script>

<div data-slot="stack">
  <OTPInput disabled defaultValue="123456" aria-label="Disabled code">
    <OTPInputGroup>
      {#each { length: 6 } as _, index}
        <OTPInputSlot index={index} />
      {/each}
    </OTPInputGroup>
  </OTPInput>
  <OTPInput readOnly defaultValue="654321" aria-label="Read-only code">
    <OTPInputGroup>
      {#each { length: 6 } as _, index}
        <OTPInputSlot index={index} />
      {/each}
    </OTPInputGroup>
  </OTPInput>
</div>
