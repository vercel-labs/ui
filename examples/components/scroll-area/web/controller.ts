import "@ui-sdk/web/scroll-area"

const tags = Array.from({ length: 50 }, (_, index) => `v1.2.0-beta.${50 - index}`)

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-scroll-area>
        <ui-scroll-area-viewport>
          <ui-scroll-area-content>
            ${tags.map((tag) => `<div>${tag}</div>`).join("")}
          </ui-scroll-area-content>
        </ui-scroll-area-viewport>
        <ui-scroll-area-scrollbar>
          <ui-scroll-area-thumb></ui-scroll-area-thumb>
        </ui-scroll-area-scrollbar>
      </ui-scroll-area>
      <div data-slot="stack">
        <button data-variant="secondary" type="button" data-start>Back to top</button>
        <button data-variant="secondary" type="button" data-end>Jump to the end</button>
        <output data-slot="output">At the start</output>
      </div>
    </div>
  `
  const area = root.querySelector("ui-scroll-area")!
  const output = root.querySelector("output")!
  root
    .querySelector("[data-start]")!
    .addEventListener("click", () => area.api.scrollToStart({ behavior: "smooth" }))
  root
    .querySelector("[data-end]")!
    .addEventListener("click", () => area.api.scrollToEnd({ behavior: "instant" }))
  root.querySelector("ui-scroll-area-viewport")!.addEventListener("scroll", () => {
    output.textContent = area.api.isAtEnd()
      ? "At the end"
      : area.api.isAtStart()
        ? "At the start"
        : "In between"
  })
}

export { mount }
