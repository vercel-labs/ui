import {
  InjectionToken,
  provideZonelessChangeDetection,
  signal,
  type ApplicationRef,
  type Type,
} from "@angular/core"
import {
  createApplication,
  provideClientHydration,
  withNoHttpTransferCache,
} from "@angular/platform-browser"

const apps = new Set<ApplicationRef>()

// Whether the fixture renders from `items`, as its `angular-data.ts` asks.
const DATA = new InjectionToken<boolean>("data")
let flushing = false

/**
 * A signal for a fixture's own state. Specs read the page as soon as an event
 * returns and Angular renders a frame later, so a write renders in the same task.
 */
function state<T>(initial: T) {
  const value = signal(initial)
  const { set } = value
  value.set = (next) => {
    set(next)
    if (flushing) {
      return
    }
    flushing = true
    queueMicrotask(() => {
      flushing = false
      apps.forEach((app) => app.tick())
    })
  }
  value.update = (change) => value.set(change(value()))
  return value
}

// The fixture's component takes the root as its host, so the page has the
// same elements as in the other frameworks. `hydrate` is for a root that
// holds the fixture's server markup.
async function mountAngular(
  component: Type<unknown>,
  root: HTMLElement,
  { data = false, hydrate = false } = {}
) {
  const app = await createApplication({
    providers: [
      provideZonelessChangeDetection(),
      { provide: DATA, useValue: data },
      hydrate ? provideClientHydration(withNoHttpTransferCache()) : [],
    ],
  })
  apps.add(app)
  app.bootstrap(component, root)
  return () => {
    apps.delete(app)
    app.destroy()
  }
}

export { DATA, mountAngular, state }
