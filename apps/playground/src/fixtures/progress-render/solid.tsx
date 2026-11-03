import { Avatar, AvatarFallback } from "@ui-sdk/solid/avatar"
import { OTPInput, OTPInputSlot } from "@ui-sdk/solid/otp-input"
import { Progress, ProgressIndicator, ProgressTrack, ProgressValue } from "@ui-sdk/solid/progress"
import { render } from "@solidjs/web"
import { createSignal, For } from "solid-js"

// Parts rendered as other elements, and with functions of their state, for
// Progress, Avatar and OTP Input.
function Fixture() {
  const [value, setValue] = createSignal(40)
  return (
    <div class="fixture">
      <button>Before</button>
      <Progress
        value={value()}
        aria-label="Export"
        render={(props) => <section {...props} />}
        class={(state) => `gauge is-${state.status}`}
      >
        <ProgressValue>{(state) => `${state.percent}% done`}</ProgressValue>
        <ProgressTrack class="gauge-track">
          <ProgressIndicator class="gauge-indicator" />
        </ProgressTrack>
      </Progress>
      <Avatar class="avatar" render={(props) => <div {...props} />}>
        <AvatarFallback class={(state) => `avatar-fallback is-${state.loadingStatus}`}>RF</AvatarFallback>
      </Avatar>
      <OTPInput aria-label="PIN" maxLength={4} class="otp" render={(props) => <section {...props} />}>
        <For each={[0, 1, 2, 3]}>
          {(index) => (
            <OTPInputSlot index={index} class={(state) => `otp-slot${state.active ? " is-active" : ""}`}>
              {(state) => state.char ?? "·"}
            </OTPInputSlot>
          )}
        </For>
      </OTPInput>
      <button onClick={() => setValue(100)}>Finish</button>
      <button>After</button>
      <output role="status" aria-label="Last action" />
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
