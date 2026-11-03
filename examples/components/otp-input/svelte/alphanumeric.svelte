<script lang="ts">
  import { OTPInput, OTPInputGroup, OTPInputSeparator, OTPInputSlot } from "@ui-sdk/svelte/otp-input"
  import { MinusIcon } from "@lucide/svelte"

</script>

<OTPInput maxLength={8} pattern="alphanumeric" aria-label="Recovery code">
  <OTPInputGroup>
    {#each { length: 4 } as _, index}
      <OTPInputSlot index={index} />
    {/each}
  </OTPInputGroup>
  <OTPInputSeparator>
    <MinusIcon aria-hidden="true" />
  </OTPInputSeparator>
  <OTPInputGroup>
    {#each { length: 4 } as _, index}
      <OTPInputSlot index={index + 4} />
    {/each}
  </OTPInputGroup>
</OTPInput>
