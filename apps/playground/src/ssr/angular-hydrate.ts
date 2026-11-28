// What an `angular-ssr` fixture does: fetches its server HTML from `/__ssr`,
// which renders it in Node, shows it, records what the specs read, then
// hydrates it. Every mismatch Angular reports is recorded.
import type { Type } from "@angular/core"
import { serializeForm } from "../../../../tests/fixtures/select"
import { mountAngular } from "../angular-mount"

async function hydrateFixture(root: HTMLElement, fixture: Type<unknown>) {
  const errors: string[] = []
  const page = window as unknown as Record<string, unknown>
  page.__hydrationErrors = errors
  const search = new URLSearchParams(location.search)
  const name = search.get("fixture") ?? ""
  const request = new URLSearchParams({
    fixture: name,
    framework: "angular",
    url: location.href,
  })
  const response = await fetch(`/__ssr?${request}`)
  const template = document.createElement("template")
  template.innerHTML = await response.text()
  if (!response.ok) {
    throw new Error(
      `Server rendering ${name} failed:\n${template.content.textContent}`
    )
  }
  // The server's root becomes the page's. Angular reads the marker and the
  // state beside it from the body.
  const served = template.content.querySelector("#root")!
  for (const attribute of served.attributes) {
    root.setAttribute(attribute.name, attribute.value)
  }
  root.replaceChildren(...served.childNodes)
  served.remove()
  document.body.append(template.content)
  // What the page shows before hydration, and whether open content shows
  // before any script runs on it, as server HTML would.
  page.__serverHtml = root.innerHTML
  page.__visibleBeforeHydration = !!root
    .querySelector<HTMLElement>('[data-slot$="-content"]')
    ?.checkVisibility()
  const form = root.querySelector("form")
  page.__serverForm = form ? serializeForm(form) : ""
  const run = () => {
    const warn = console.warn
    const error = console.error
    console.warn = (...args: unknown[]) => {
      errors.push(args.map(String).join(" "))
      warn(...args)
    }
    console.error = (...args: unknown[]) => {
      errors.push(args.map(String).join(" "))
      error(...args)
    }
    return mountAngular(fixture, root, {
      data: search.has("data"),
      hydrate: true,
    })
  }
  // With ?hydrate=manual, the page stays server markup until window.hydrate() runs.
  if (search.get("hydrate") === "manual") {
    page.hydrate = run
  } else {
    await run()
  }
}

export { hydrateFixture }
