import { hydrateFixture } from "../../svelte-ssr"
import TimelineFixture from "./TimelineFixture.svelte"

// The server's markup is kept for specs that read it.
async function mount(root: HTMLElement) {
  await hydrateFixture(root, "timeline", TimelineFixture, {})
  const page = window as unknown as {
    __serverHtml: string
    __serverMarkup: string
  }
  page.__serverMarkup = page.__serverHtml
}

export { mount }
