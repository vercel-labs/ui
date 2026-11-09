<script lang="ts">
  import type { ChangeDetails } from "@ui-sdk/core"
  import {
    createOTPInputController,
    OTPInput,
    OTPInputGroup,
    OTPInputSeparator,
    OTPInputSlot,
  } from "@ui-sdk/svelte"
  import {
    otpInputAction,
    otpInputFixture,
    otpInputOptions,
  } from "tests/fixtures/otp-input.ts"

  const controller = createOTPInputController()
  const { cancel, ...options } = otpInputOptions()
  const { code, recovery, form } = otpInputFixture
  let action = $state("")
  let submitted = $state("")
  // The first index of each group.
  const starts = code.groups.map((_, group) =>
    code.groups.slice(0, group).reduce((sum, size) => sum + size, 0)
  )

  function onValueChange(value: string, details: ChangeDetails) {
    if (cancel && value.includes(cancel)) {
      return details.cancel()
    }
    action = otpInputAction.change(value, details.reason)
  }

  function onValueCommit(value: string) {
    action = otpInputAction.complete(value)
  }

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    submitted = String(
      new FormData(event.currentTarget as HTMLFormElement).get(code.name)
    )
  }
</script>

<div class="fixture">
  <button>Before</button>
  <form aria-label={form.label} onsubmit={onSubmit}>
    <OTPInput
      class="otp"
      aria-label={code.label}
      name={code.name}
      maxLength={code.length}
      {controller}
      {...options}
      {onValueChange}
      {onValueCommit}
    >
      {#each code.groups as size, group (group)}
        {#if group > 0}
          <OTPInputSeparator class="otp-separator">-</OTPInputSeparator>
        {/if}
        <OTPInputGroup class="otp-group">
          {#each { length: size } as _, slot (slot)}
            <OTPInputSlot index={starts[group] + slot} class="otp-slot" />
          {/each}
        </OTPInputGroup>
      {/each}
    </OTPInput>
    <button type="submit">{form.submit}</button>
    <button type="reset">{form.reset}</button>
  </form>
  <OTPInput
    class="otp"
    aria-label={recovery.label}
    maxLength={recovery.length}
    pattern="alphanumeric"
  >
    <OTPInputGroup class="otp-group">
      {#each { length: recovery.length } as _, slot (slot)}
        <OTPInputSlot index={slot} class="otp-slot" />
      {/each}
    </OTPInputGroup>
  </OTPInput>
  <button onclick={() => controller.setValue(otpInputFixture.filled)}
    >Fill code</button
  >
  <button onclick={() => controller.clear()}>Clear code</button>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output aria-label="Submitted">{submitted}</output>
</div>
