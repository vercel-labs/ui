import "@ui-sdk/web/scroll-area"

const tags = Array.from({ length: 50 }, (_, index) => `v1.2.0-beta.${50 - index}`)

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-scroll-area>
      <ui-scroll-area-viewport>
        <ui-scroll-area-content>
          <h4>Tags</h4>
          ${tags.map((tag) => `<div>${tag}</div>`).join("")}
        </ui-scroll-area-content>
      </ui-scroll-area-viewport>
      <ui-scroll-area-scrollbar>
        <ui-scroll-area-thumb></ui-scroll-area-thumb>
      </ui-scroll-area-scrollbar>
    </ui-scroll-area>
  `
}

export { mount }
