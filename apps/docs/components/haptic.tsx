"use client"

// iOS has no vibrate API and plays a haptic only when a switch toggles from a real tap,
// so a transparent label over the control passes the tap to a hidden switch.
function Haptic() {
  return (
    <label aria-hidden="true" className="absolute inset-0 touch-manipulation [-webkit-tap-highlight-color:transparent]">
      <input
        type="checkbox"
        tabIndex={-1}
        {...{ switch: "" }}
        onClick={(event) => event.stopPropagation()}
        className="invisible absolute size-px"
      />
    </label>
  )
}

function vibrate() {
  navigator.vibrate?.(10)
}

export { Haptic, vibrate }
