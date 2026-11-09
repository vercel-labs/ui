// Web components bind whatever element they wrap, so a span is the button.
async function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-button data-action="span"><span class="button">Span button</span></ui-button>
      <ui-button disabled><a class="button" href="#old">Old docs</a></ui-button>
      <ui-toggle id="star"><button class="toggle"><span aria-hidden="true">☆</span> Star</button></ui-toggle>
      <ui-toggle-group class="toggle-group" aria-label="View" default-value="grid">
        <ui-toggle value="grid"><span class="toggle">Grid</span></ui-toggle>
        <ui-toggle value="list"><span class="toggle">List</span></ui-toggle>
      </ui-toggle-group>
      <ui-separator as-child><hr class="rule"></ui-separator>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `
  await import("@ui-sdk/web/toggle")
  await import("@ui-sdk/web/button")
  await import("@ui-sdk/web/separator")
  const say = (text: string) =>
    (root.querySelector("output")!.textContent = text)
  root.addEventListener(
    "action",
    (event) => {
      const action = (event.target as HTMLElement).dataset.action
      if (action) {
        say(action)
      }
    },
    { capture: true }
  )
  root.querySelector("#star")!.addEventListener("pressedchange", (event) => {
    if (event.target !== event.currentTarget) {
      return
    }
    say(
      (event as CustomEvent<{ value: boolean }>).detail.value
        ? "star"
        : "unstar"
    )
  })
  root.addEventListener(
    "valuechange",
    (event) =>
      say((event as CustomEvent<{ value: string[] }>).detail.value.join(", ")),
    { capture: true }
  )
}

export { mount }
