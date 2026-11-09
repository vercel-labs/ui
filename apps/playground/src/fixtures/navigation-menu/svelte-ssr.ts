import { hydrateFixture } from "../../svelte-ssr"
import NavigationMenuFixture from "./NavigationMenuFixture.svelte"

async function mount(root: HTMLElement) {
  await hydrateFixture(root, "navigation-menu", NavigationMenuFixture, {})
  // The navigation menu specs read the server's HTML under this name.
  const recorded = window as unknown as {
    __serverHtml: string
    __serverHTML: string
  }
  recorded.__serverHTML = recorded.__serverHtml
}

export { mount }
