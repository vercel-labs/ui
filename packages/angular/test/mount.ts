import "@angular/compiler"
import {
  createComponent,
  provideZonelessChangeDetection,
  type Provider,
  type Type,
} from "@angular/core"
import { createApplication } from "@angular/platform-browser"
import { onTestFinished } from "vitest"

// jsdom has no Web Animations, which core asks for as a panel leaves.
Element.prototype.getAnimations ??= () => []
// jsdom has no layout either, which a list asks for as it highlights an item.
Element.prototype.scrollIntoView ??= () => {}

async function mount<Component>(
  component: Type<Component>,
  providers: Provider[] = []
) {
  const host = document.createElement("div")
  document.body.append(host)
  const app = await createApplication({
    providers: [provideZonelessChangeDetection(), providers],
  })
  const ref = createComponent(component, {
    environmentInjector: app.injector,
    hostElement: host,
  })
  app.attachView(ref.hostView)
  onTestFinished(() => {
    app.destroy()
    host.remove()
  })
  await app.whenStable()
  return { host, instance: ref.instance, settle: () => app.whenStable() }
}

export { mount }
