// A microtask, since Vue binds mid-hydration and a write then leaves a part with the
// server's attributes. React runs them at the end of its commit (`runBindWrites`), so
// a mount inside `act()` leaves no update behind.
const pending = new Set<() => void>()
let scheduled = false

function afterBind(write: () => void) {
  pending.add(write)
  if (!scheduled) {
    scheduled = true
    queueMicrotask(runBindWrites)
  }
}

function runBindWrites() {
  scheduled = false
  try {
    for (const write of pending) {
      pending.delete(write)
      write()
    }
  } finally {
    if (pending.size && !scheduled) {
      scheduled = true
      queueMicrotask(runBindWrites)
    }
  }
}

export { afterBind, runBindWrites }
