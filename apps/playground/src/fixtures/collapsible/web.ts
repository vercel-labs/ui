import { createCollapsibleController } from "@ui-sdk/core/collapsible"
import { collapsibleFixture as fixture } from "tests/fixtures/collapsible.ts"
import { collapsibleOptions } from "tests/fixtures/page.ts"

type CollapsibleElement = HTMLElement & { open?: boolean; controller?: unknown }

async function mount(root: HTMLElement) {
  const { cancel, defaultOpen, disabled, keepMounted, hiddenUntilFound } = collapsibleOptions()
  const panel = [keepMounted && "keep-mounted", hiddenUntilFound && "hidden-until-found"].filter(Boolean)
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-collapsible class="collapsible"${defaultOpen ? " default-open" : ""}${disabled ? " disabled" : ""}>
        <ui-collapsible-trigger><button class="collapsible-trigger">${fixture.trigger}</button></ui-collapsible-trigger>
        <ui-collapsible-panel class="collapsible-panel" ${panel.join(" ")}>
          <p>${fixture.content}</p>
          <label>${fixture.field} <input></label>
          <button data-close>${fixture.close}</button>
        </ui-collapsible-panel>
      </ui-collapsible>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <output aria-label="Last reason"></output>
      <output aria-label="Last source"></output>
      <output aria-label="Last completed"></output>
      <button data-toggle>${fixture.controller}</button>
    </div>
  `
  await import("@ui-sdk/web/collapsible")
  const collapsible = root.querySelector<CollapsibleElement>("ui-collapsible")!
  const output = (name: string) => root.querySelector(`output[aria-label="${name}"]`)!
  const controller = createCollapsibleController()
  collapsible.controller = controller
  root.querySelector("[data-close]")!.addEventListener("click", () => controller.close())
  root.querySelector("[data-toggle]")!.addEventListener("click", () => controller.toggle())
  collapsible.addEventListener("openchange", (event) => {
    const detail = (event as CustomEvent<{ value: boolean; reason: string; source: string }>).detail
    if (cancel === (detail.value ? "open" : "close")) return event.preventDefault()
    output("Last action").textContent = detail.value ? "open" : "closed"
    output("Last reason").textContent = detail.reason
    output("Last source").textContent = detail.source
  })
  collapsible.addEventListener("openchangecomplete", (event) => {
    output("Last completed").textContent = (event as CustomEvent<{ value: boolean }>).detail.value
      ? "open"
      : "closed"
  })
}

export { mount }
