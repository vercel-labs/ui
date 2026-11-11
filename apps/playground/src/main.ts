import { applyFixtureOptions, loadScreenReader } from "tests/fixtures/page.ts"
import { renderIndex } from "./index"

// /?fixture=menu&framework=react loads src/fixtures/menu/react.tsx.
const fixtures = import.meta.glob("./fixtures/*/*.{ts,tsx}")

// Specs that check core's modules load them through the page, as the
// instances the fixture uses, whether Vite serves the page or it's built. A
// module is named by its file, like "modal" for `foundation/popups/modal.ts`.
const coreModules = import.meta.glob(
  "../../../packages/core/src/foundation/*/*.ts"
)
Object.assign(window, {
  loadCoreModule: (name: string) =>
    Object.entries(coreModules).find(([file]) =>
      file.endsWith(`/${name}.ts`)
    )![1](),
  loadTesting: () => import("@ui-sdk/core/testing"),
})

const params = applyFixtureOptions()
// A popup loads its sheet code in idle time once it's on the page, and specs
// press as soon as the page is up, so a page that presents popups as sheets
// loads it first, unless ?lazy leaves that to the popups.
if (params.has("presentation") && !params.has("lazy")) {
  await import("../../../packages/core/src/foundation/popups/sheet-presentation.ts")
}
// ?agent puts an agent bridge on the page as `window.__agent`, before any component is made.
if (params.has("agent")) {
  Object.assign(window, {
    __agent: (await import("@ui-sdk/core/agent")).createAgent(),
  })
}
const fixture = params.get("fixture")
const framework = params.get("framework") ?? "react"
const [name, variant] = framework.split("-")
// Solid pages run with Solid's own dev checker on, and list what it reports
// as `window.solidDiagnostics` for the specs, which fail on any code: each
// one means a component goes against Solid's guidance. Its time budgets are
// off, since how long a run takes depends on the machine, not the code. The
// leak page measures what stays in memory, which the checker's history would
// keep alive.
if (name === "solid" && fixture !== "leaks") {
  const [{ attribution }, { OBSERVE }] = await Promise.all([
    import("solid-js/attribution"),
    import("solid-js"),
  ])
  const diagnostics: { code: string; message: string; owner?: string }[] = []
  OBSERVE?.diagnostics.subscribe((event) =>
    diagnostics.push({
      code: event.code,
      message: event.message,
      owner: event.ownerPath?.join(" › "),
    })
  )
  attribution.enable({ log: false, hotTime: false, wastedRecompute: false })
  Object.assign(window, { solidDiagnostics: diagnostics })
}
const path =
  fixture &&
  Object.keys(fixtures).find((key) =>
    key.startsWith(
      `./fixtures/${fixture}/${variant ? `${name}-${variant}` : name}.`
    )
  )

if (!fixture) {
  // No fixture: the index of every fixture, to browse by hand.
  renderIndex(document.getElementById("root")!, Object.keys(fixtures))
} else if (!path) {
  // Specs skip themselves for frameworks that have no fixture yet.
  document.body.dataset.missingFixture = ""
  document.body.textContent = `No fixture for ${fixture} in ${framework}.`
} else {
  const module = (await fixtures[path]()) as {
    mount: (root: HTMLElement) => void | Promise<void>
  }
  await module.mount(document.getElementById("root")!)
  // Specs wait for this, since a mount can wait on a component it imports late.
  document.body.dataset.mounted = ""
  await loadScreenReader()
}
