import { Avatar, AvatarFallback } from "@ui-sdk/react/avatar"
import { OTPInput, OTPInputSlot } from "@ui-sdk/react/otp-input"
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
  ProgressValue,
} from "@ui-sdk/react/progress"
import * as React from "react"
import { createRoot } from "react-dom/client"

// Parts rendered as other elements, and with functions of their state, for
// Progress, Avatar and OTP Input.
function Fixture() {
  const [value, setValue] = React.useState(40)
  return (
    <div className="fixture">
      <button>Before</button>
      <Progress
        value={value}
        aria-label="Export"
        render={<section />}
        className={(state) => `gauge is-${state.status}`}
      >
        <ProgressValue>{(state) => `${state.percent}% done`}</ProgressValue>
        <ProgressTrack className="gauge-track">
          <ProgressIndicator className="gauge-indicator" />
        </ProgressTrack>
      </Progress>
      <Avatar className="avatar" render={<div />}>
        <AvatarFallback
          className={(state) => `avatar-fallback is-${state.loadingStatus}`}
        >
          RF
        </AvatarFallback>
      </Avatar>
      <OTPInput
        aria-label="PIN"
        maxLength={4}
        className="otp"
        render={<section />}
      >
        {[0, 1, 2, 3].map((index) => (
          <OTPInputSlot
            key={index}
            index={index}
            className={(state) => `otp-slot${state.active ? " is-active" : ""}`}
          >
            {(state) => state.char ?? "·"}
          </OTPInputSlot>
        ))}
      </OTPInput>
      <button onClick={() => setValue(100)}>Finish</button>
      <button>After</button>
      <output role="status" aria-label="Last action" />
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
