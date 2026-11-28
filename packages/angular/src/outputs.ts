import { computed, OutputEmitterRef, signal } from "@angular/core"
import type { ActionDetails, ChangeDetails } from "@ui-sdk/core"

// What a `(before<Key>Change)` output emits: the value about to be set, why,
// and `cancel()` to keep the current one.
type Change<Value, Reason extends string = string> = ChangeDetails<Reason> & {
  /** The value the change would set. */
  value: Value
}

// An output carries one value, so a change is two outputs: `before` with the
// details, then `changed` with the value alone, which `[(key)]` listens to.
const emitChange =
  <Emitted extends ChangeDetails<string> & { value: unknown }>(
    before: OutputEmitterRef<Emitted>,
    changed?: OutputEmitterRef<Emitted["value"]>
  ) =>
  (value: Emitted["value"], details: ChangeDetails<string>) => {
    before.emit(Object.assign(details, { value }) as Emitted)
    if (!details.canceled) {
      changed?.emit(value)
    }
  }

// The same for a root typed by its own values, like `Tabs<"a" | "b">`. Core
// holds them as plain strings, and they are the ones the root was given.
const emitTypedChange = <
  Emitted extends ChangeDetails<string> & { value: unknown },
>(
  before: OutputEmitterRef<Emitted>,
  changed?: OutputEmitterRef<Emitted["value"]>
) =>
  emitChange(before, changed) as (
    value: unknown,
    details: ChangeDetails<string>
  ) => void

// What an `(action)` output emits: the press, how it was made, and `waitUntil()`.
type Action = ActionDetails & {
  /** The press that ran the action. An agent's press has none. */
  event: Event | undefined
  /** Keeps the part pending until the Promise settles. A rejection becomes the part's error. */
  waitUntil: (promise: Promise<unknown>) => void
}

// An output that knows whether anything listens, for a callback whose
// presence changes what core does, like a textarea's `onSubmit`.
class ListenedEmitter<Emitted> extends OutputEmitterRef<Emitted> {
  readonly #listened = signal(false)
  /** Whether a listener ever subscribed. */
  readonly listened = this.#listened.asReadonly()

  override subscribe(callback: (value: Emitted) => void) {
    this.#listened.set(true)
    return super.subscribe(callback)
  }
}

// What an output that can be waited on adds to what it emits.
type Waiting = {
  /** Keeps the part pending until the Promise settles. A rejection becomes the part's error. */
  waitUntil: (promise: Promise<unknown>) => void
}

// Emits with `waitUntil()`, and returns what the listeners asked to wait for.
function emitWaiting<Emitted extends object>(
  emitter: OutputEmitterRef<Emitted & Waiting>,
  emitted: Emitted
) {
  const waiting: Promise<unknown>[] = []
  let emitting = true
  emitter.emit({
    ...emitted,
    waitUntil(promise) {
      if (!emitting) {
        throw new Error(
          "waitUntil() can only be called while the output emits."
        )
      }
      waiting.push(promise)
    },
  })
  emitting = false
  return waiting.length ? Promise.all(waiting) : undefined
}

// An `(action)` output. A part with a listener runs it before what the press
// does next, and one without keeps its plain press.
class ActionEmitter extends ListenedEmitter<Action> {
  readonly #run = (event: Event | undefined, details: ActionDetails) =>
    emitWaiting(this, { ...details, event })
  /** The part's `action` prop. */
  readonly handler = computed(() => (this.listened() ? this.#run : undefined))
}

// An action only its event describes, like a menu item's `(select)`.
class EventActionEmitter extends ListenedEmitter<Waiting & { event: Event }> {
  readonly #run = (event: Event) => emitWaiting(this, { event })
  /** The part's callback prop. */
  readonly handler = computed(() => (this.listened() ? this.#run : undefined))
}

// An action that carries a value, like a menu's, which runs for the item chosen.
class ValueActionEmitter<Value, Details extends object> extends ListenedEmitter<
  Details & Waiting & { value: Value }
> {
  readonly #run = (value: Value, details: Details) =>
    emitWaiting(this, { ...details, value })
  /** The component's action option. */
  readonly handler = computed(() => (this.listened() ? this.#run : undefined))
}

export {
  type Action,
  ActionEmitter,
  type Change,
  emitChange,
  emitTypedChange,
  emitWaiting,
  EventActionEmitter,
  ListenedEmitter,
  ValueActionEmitter,
  type Waiting,
}
