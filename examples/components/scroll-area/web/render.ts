import "@ui-sdk/web/scroll-area"

const tags = Array.from({ length: 50 }, (_, index) => `v1.2.0-beta.${50 - index}`)

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-scroll-area>
      <ui-scroll-area-viewport role="region" aria-label="Releases">
        <ui-scroll-area-content>
          ${tags.map((tag) => `<p>${tag}</p>`).join("")}
        </ui-scroll-area-content>
      </ui-scroll-area-viewport>
      <p data-slot="hint" aria-hidden="true">
        <span data-show="start">Scroll for older releases</span>
        <span data-show="more">Keep going</span>
      </p>
      <ui-scroll-area-scrollbar>
        <ui-scroll-area-thumb></ui-scroll-area-thumb>
      </ui-scroll-area-scrollbar>
    </ui-scroll-area>
  `
}

export { mount }
