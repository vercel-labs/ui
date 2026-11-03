<script lang="ts">
  import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/svelte/otp-input"

</script>

<OTPInput maxLength={5} aria-label="Invite code">
  {#snippet children(state)}
    <OTPInputGroup>
      {#each { length: state.slots.length } as _, index}
        <OTPInputSlot {index}>
          {#snippet render({ props, state: slot })}
            <span {...props}>
              {#if slot.char}
                {slot.char}
              {:else if slot.hasFakeCaret}
                <span></span>
              {/if}
            </span>
          {/snippet}
        </OTPInputSlot>
      {/each}
    </OTPInputGroup>
  {/snippet}
</OTPInput>
