import "@ui-sdk/web/scroll-area"

const releases = Array.from({ length: 12 }, (_, row) => ({
  version: `v1.${12 - row}.0`,
  cells: [
    "Stable",
    "Downloads 12k",
    "Node 20+",
    "MIT",
    "4.1 MB",
    `2026-0${(row % 9) + 1}-14`,
    "No breaking changes",
  ],
}))

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-scroll-area type="auto">
      <ui-scroll-area-viewport>
        <ui-scroll-area-content>
          <table>
            <tbody>
              ${releases
                .map(
                  (release) => `
                    <tr>
                      <th>${release.version}</th>
                      ${release.cells.map((cell) => `<td>${cell}</td>`).join("")}
                    </tr>`,
                )
                .join("")}
            </tbody>
          </table>
        </ui-scroll-area-content>
      </ui-scroll-area-viewport>
      <ui-scroll-area-scrollbar>
        <ui-scroll-area-thumb></ui-scroll-area-thumb>
      </ui-scroll-area-scrollbar>
      <ui-scroll-area-scrollbar orientation="horizontal">
        <ui-scroll-area-thumb></ui-scroll-area-thumb>
      </ui-scroll-area-scrollbar>
      <ui-scroll-area-corner></ui-scroll-area-corner>
    </ui-scroll-area>
  `
}

export { mount }
