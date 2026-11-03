import {
  createOTPInputController,
  OTPInput,
  OTPInputGroup,
  OTPInputSeparator,
  OTPInputSlot,
} from "@ui-sdk/solid/otp-input"
import { render } from "@solidjs/web"
import { createSignal, Show } from "solid-js"
import { otpInputAction, otpInputFixture, otpInputOptions } from "tests/fixtures/otp-input.ts"

const controller = createOTPInputController()

function Fixture() {
  const [action, setAction] = createSignal("")
  const [submitted, setSubmitted] = createSignal("")
  const { cancel, ...options } = otpInputOptions()
  const { code, recovery, form } = otpInputFixture
  // Each group's slot indices, counted across the groups.
  let next = 0
  const groups = code.groups.map((size) => Array.from({ length: size }, () => next++))
  return (
    <div class="fixture">
      <button>Before</button>
      <form
        aria-label={form.label}
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(String(new FormData(event.currentTarget).get(code.name)))
        }}
      >
        <OTPInput
          class="otp"
          aria-label={code.label}
          name={code.name}
          maxLength={code.length}
          controller={controller}
          {...options}
          onValueChange={(value, details) => {
            if (cancel && value.includes(cancel)) return details.cancel()
            setAction(otpInputAction.change(value, details.reason))
          }}
          onValueCommit={(value) => setAction(otpInputAction.complete(value))}
        >
          {groups.map((indices, group) => (
            <>
              <Show when={group > 0}>
                <OTPInputSeparator class="otp-separator">-</OTPInputSeparator>
              </Show>
              <OTPInputGroup class="otp-group">
                {indices.map((index) => (
                  <OTPInputSlot index={index} class="otp-slot" />
                ))}
              </OTPInputGroup>
            </>
          ))}
        </OTPInput>
        <button type="submit">{form.submit}</button>
        <button type="reset">{form.reset}</button>
      </form>
      <OTPInput class="otp" aria-label={recovery.label} maxLength={recovery.length} pattern="alphanumeric">
        <OTPInputGroup class="otp-group">
          {Array.from({ length: recovery.length }, (_, slot) => (
            <OTPInputSlot index={slot} class="otp-slot" />
          ))}
        </OTPInputGroup>
      </OTPInput>
      <button onClick={() => controller.setValue(otpInputFixture.filled)}>Fill code</button>
      <button onClick={() => controller.clear()}>Clear code</button>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <output aria-label="Submitted">{submitted()}</output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
