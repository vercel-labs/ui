import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/react/otp-input"

export function Example() {
  return (
    <OTPInput
      maxLength={5}
      aria-label="Invite code"
      className={(state) =>
        state.complete
          ? "flex items-center gap-2 rounded-3xl bg-muted p-1 transition-colors"
          : state.focused
            ? "flex items-center gap-2 rounded-3xl bg-muted/50 p-1 transition-colors"
            : "flex items-center gap-2 rounded-3xl p-1 transition-colors"
      }
    >
      {(state) => (
        <OTPInputGroup className="flex items-center gap-1.5">
          {state.slots.map((_, index) => (
            <OTPInputSlot
              key={index}
              index={index}
              render={<span />}
              className={(slot) =>
                slot.active
                  ? "flex size-10 items-center justify-center rounded-2xl border border-ring bg-input/50 text-lg font-medium ring-3 ring-ring/30 transition-[color,box-shadow] duration-200"
                  : "flex size-10 items-center justify-center rounded-2xl border border-transparent bg-input/50 text-lg font-medium transition-[color,box-shadow] duration-200"
              }
            >
              {(slot) =>
                slot.char ??
                (slot.hasFakeCaret && <span className="h-5 w-px animate-caret-blink bg-foreground" />)
              }
            </OTPInputSlot>
          ))}
        </OTPInputGroup>
      )}
    </OTPInput>
  )
}
