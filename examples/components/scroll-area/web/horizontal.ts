import "@ui-sdk/web/scroll-area"

const artworks = [
  { title: "Dunes at dusk" },
  { title: "Harbor fog" },
  { title: "Moss study" },
  { title: "Night market" },
  { title: "Salt flats" },
  { title: "Copper roofs" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-scroll-area>
      <ui-scroll-area-viewport>
        <ui-scroll-area-content>
          ${artworks
            .map(
              (artwork) => `
                <figure>
                  <div></div>
                  <figcaption>${artwork.title}</figcaption>
                </figure>`,
            )
            .join("")}
        </ui-scroll-area-content>
      </ui-scroll-area-viewport>
      <ui-scroll-area-scrollbar orientation="horizontal">
        <ui-scroll-area-thumb></ui-scroll-area-thumb>
      </ui-scroll-area-scrollbar>
    </ui-scroll-area>
  `
}

export { mount }
