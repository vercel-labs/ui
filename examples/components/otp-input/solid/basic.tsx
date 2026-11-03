import { OTPInput, OTPInputGroup, OTPInputSeparator, OTPInputSlot } from "@ui-sdk/solid/otp-input"

export function Example() {
  return (
    <OTPInput maxLength={6} aria-label="Verification code">
      <OTPInputGroup>
        <OTPInputSlot index={0} />
        <OTPInputSlot index={1} />
        <OTPInputSlot index={2} />
      </OTPInputGroup>
      <OTPInputSeparator>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
        </svg>
      </OTPInputSeparator>
      <OTPInputGroup>
        <OTPInputSlot index={3} />
        <OTPInputSlot index={4} />
        <OTPInputSlot index={5} />
      </OTPInputGroup>
    </OTPInput>
  )
}
