import {
  APP_ID,
  createComponent,
  provideZonelessChangeDetection,
  type Type,
} from "@angular/core"
import { createApplication } from "@angular/platform-browser"
import { LogKey } from "../shared/angular/log"

let apps = 0

// The docs preview shows logged messages in its console pane. Each example is
// its own application, with its own id prefix, inside an element that leaves
// the preview's layout alone.
export function mount(module: { Example: Type<unknown> }, host: HTMLElement) {
  const element = host.ownerDocument.createElement("ui-example")
  element.style.display = "contents"
  host.append(element)
  const log = (message: string) =>
    host.dispatchEvent(
      new CustomEvent("example-log", { bubbles: true, detail: message })
    )
  const app = createApplication({
    providers: [
      provideZonelessChangeDetection(),
      { provide: APP_ID, useValue: `example-${++apps}` },
      { provide: LogKey, useValue: log },
    ],
  }).then((app) => {
    const ref = createComponent(module.Example, {
      environmentInjector: app.injector,
      hostElement: element,
    })
    app.attachView(ref.hostView)
    return app
  })
  return () => {
    void app.then((app) => app.destroy())
    element.remove()
  }
}
