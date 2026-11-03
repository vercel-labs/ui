import { createToggleController, Toggle, ToggleIcon } from "@ui-sdk/solid/toggle"
import { createSignal } from "solid-js"

function Example() {
  const notifications = createToggleController()
  const [pressed, setPressed] = createSignal(true)
  const [reason, setReason] = createSignal("")

  return (
    <div data-slot="stack">
      <Toggle
        pressed={pressed()}
        onPressedChange={(next, details) => {
          setPressed(next)
          setReason(details.reason)
        }}
        controller={notifications}
      >
        <ToggleIcon data-variant="fill">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M10.268 21a2 2 0 0 0 3.464 0" />
            <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
          </svg>
        </ToggleIcon>
        Notifications
      </Toggle>
      <button type="button" onClick={() => notifications.toggle()}>
        Toggle from outside
      </button>
      <output data-slot="output">
        Notifications: {pressed() ? "on" : "off"}
        {reason() && `, last change: ${reason()}`}
      </output>
    </div>
  )
}

export { Example }
