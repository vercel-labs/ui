import "@ui-sdk/web/carousel"
import { Pause, Play, createElement } from "lucide"

const photos = [
  { name: "Dunes" },
  { name: "Forest" },
  { name: "Glacier" },
  { name: "Canyon" },
  { name: "Meadow" },
  { name: "Harbor" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-carousel aria-label="Photos" default-playing interval="4000">
      <ui-carousel-viewport>
        <ui-carousel-content>
          ${photos.map((photo) => `<ui-carousel-item><div data-slot="tile">${photo.name}</div></ui-carousel-item>`).join("")}
        </ui-carousel-content>
      </ui-carousel-viewport>
      <div data-slot="row">
        <ui-carousel-play-toggle>
          <button data-variant="secondary">
            <span data-show="playing">${createElement(Pause, { "aria-hidden": "true" }).outerHTML}<span data-slot="visually-hidden">Stop slide rotation</span></span>
            <span data-show="stopped">${createElement(Play, { "aria-hidden": "true" }).outerHTML}<span data-slot="visually-hidden">Start slide rotation</span></span>
          </button>
        </ui-carousel-play-toggle>
        <ui-carousel-indicator-group aria-label="Choose a photo">
          ${photos.map((photo) => `<ui-carousel-indicator><button aria-label="${photo.name}"><span></span></button></ui-carousel-indicator>`).join("")}
        </ui-carousel-indicator-group>
      </div>
      <p data-slot="hint" aria-live="polite"></p>
    </ui-carousel>
  `
  const output = root.querySelector("p")!
  root.querySelector("ui-carousel")!.addEventListener("playingchange", (event) => {
    output.textContent = `${event.detail.value ? "Playing" : "Stopped"} (${event.detail.reason})`
  })
}

export { mount }
