<script lang="ts">
  import { OTPInput, OTPInputGroup, OTPInputSeparator, OTPInputSlot } from "@ui-sdk/svelte/otp-input"
  import { MinusIcon } from "@lucide/svelte"

</script>

<OTPInput maxLength={6} aria-label="Verification code">
  <OTPInputGroup>
    <OTPInputSlot index={0} />
    <OTPInputSlot index={1} />
    <OTPInputSlot index={2} />
  </OTPInputGroup>
  <OTPInputSeparator>
    <MinusIcon aria-hidden="true" />
  </OTPInputSeparator>
  <OTPInputGroup>
    <OTPInputSlot index={3} />
    <OTPInputSlot index={4} />
    <OTPInputSlot index={5} />
  </OTPInputGroup>
</OTPInput>
