import { tabsOptions } from "tests/fixtures/page.ts"

async function mount(root: HTMLElement) {
  const { activation } = tabsOptions()
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-tabs class="tabs" default-value="overview">
        <ui-tabs-list class="tablist" aria-label="Project">
          <ui-tabs-tab value="overview"><a class="tab" href="#overview">Overview</a></ui-tabs-tab>
          <ui-tabs-tab value="activity"><a class="tab" href="#activity">Activity</a></ui-tabs-tab>
          <ui-tabs-tab value="watched"><button class="tab">Watched</button></ui-tabs-tab>
          <ui-tabs-tab value="plain"><button class="tab">Plain</button></ui-tabs-tab>
        </ui-tabs-list>
        ${["overview", "activity", "watched", "plain"]
          .map(
            (value) =>
              `<ui-tabs-panel class="panel" value="${value}">The ${value} panel.</ui-tabs-panel>`
          )
          .join("")}
      </ui-tabs>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <output role="status" aria-label="Reason"></output>
    </div>
  `
  if (activation) {
    root.querySelector("ui-tabs")!.setAttribute("activation", activation)
  }
  await import("@ui-sdk/web/tabs")
  root.addEventListener(
    "valuechange",
    (event) => {
      const { value, reason } = (
        event as CustomEvent<{ value: string; reason: string }>
      ).detail
      root.querySelector('[aria-label="Last action"]')!.textContent = value
      root.querySelector('[aria-label="Reason"]')!.textContent = reason
    },
    { capture: true }
  )
}

export { mount }
