<script lang="ts">
  import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/svelte/otp-input"

</script>

<div dir="rtl" data-slot="stack">
  <span id="otp-rtl-label" data-slot="label">رمز التحقق</span>
  <OTPInput maxLength={6} aria-labelledby="otp-rtl-label">
    <OTPInputGroup>
      {#each { length: 6 } as _, index}
        <OTPInputSlot index={index} />
      {/each}
    </OTPInputGroup>
  </OTPInput>
</div>
