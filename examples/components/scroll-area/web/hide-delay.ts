import "@ui-sdk/web/scroll-area"

const tags = Array.from({ length: 20 }, (_, index) => `v1.2.0-beta.${50 - index}`)

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      ${[0, 2000]
        .map(
          (delay) => `
            <div data-slot="stack">
              <code>scroll-hide-delay="${delay}"</code>
              <ui-scroll-area type="scroll" scroll-hide-delay="${delay}">
                <ui-scroll-area-viewport>
                  <ui-scroll-area-content>
                    ${tags.map((tag) => `<div>${tag}</div>`).join("")}
                  </ui-scroll-area-content>
                </ui-scroll-area-viewport>
                <ui-scroll-area-scrollbar>
                  <ui-scroll-area-thumb></ui-scroll-area-thumb>
                </ui-scroll-area-scrollbar>
              </ui-scroll-area>
            </div>`,
        )
        .join("")}
    </div>
  `
}

export { mount }
