import {
  createOTPInputController,
  OTPInput,
  OTPInputGroup,
  OTPInputSeparator,
  OTPInputSlot,
} from "@ui-sdk/react/otp-input"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  otpInputAction,
  otpInputFixture,
  otpInputOptions,
} from "tests/fixtures/otp-input.ts"

const controller = createOTPInputController()

function Fixture() {
  const [action, setAction] = React.useState("")
  const [submitted, setSubmitted] = React.useState("")
  const { cancel, ...options } = otpInputOptions()
  const { code, recovery, form } = otpInputFixture
  let index = 0
  return (
    <div className="fixture">
      <button>Before</button>
      <form
        aria-label={form.label}
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(String(new FormData(event.currentTarget).get(code.name)))
        }}
      >
        <OTPInput
          className="otp"
          aria-label={code.label}
          name={code.name}
          maxLength={code.length}
          controller={controller}
          {...options}
          onValueChange={(value, details) => {
            if (cancel && value.includes(cancel)) {
              return details.cancel()
            }
            setAction(otpInputAction.change(value, details.reason))
          }}
          onValueCommit={(value) => setAction(otpInputAction.complete(value))}
        >
          {code.groups.map((size, group) => (
            <React.Fragment key={group}>
              {group > 0 && (
                <OTPInputSeparator className="otp-separator">
                  -
                </OTPInputSeparator>
              )}
              <OTPInputGroup className="otp-group">
                {Array.from({ length: size }, () => (
                  <OTPInputSlot
                    key={index}
                    index={index++}
                    className="otp-slot"
                  />
                ))}
              </OTPInputGroup>
            </React.Fragment>
          ))}
        </OTPInput>
        <button type="submit">{form.submit}</button>
        <button type="reset">{form.reset}</button>
      </form>
      <OTPInput
        className="otp"
        aria-label={recovery.label}
        maxLength={recovery.length}
        pattern="alphanumeric"
      >
        <OTPInputGroup className="otp-group">
          {Array.from({ length: recovery.length }, (_, slot) => (
            <OTPInputSlot key={slot} index={slot} className="otp-slot" />
          ))}
        </OTPInputGroup>
      </OTPInput>
      <button onClick={() => controller.setValue(otpInputFixture.filled)}>
        Fill code
      </button>
      <button onClick={() => controller.clear()}>Clear code</button>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <output aria-label="Submitted">{submitted}</output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { Fixture, mount }
