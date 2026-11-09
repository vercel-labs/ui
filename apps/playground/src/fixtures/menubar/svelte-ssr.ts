import { hydrateFixture } from "../../svelte-ssr"
import MenubarFixture from "./MenubarFixture.svelte"

// The server's markup is kept under the name the menubar specs read it by.
async function mount(root: HTMLElement) {
  await hydrateFixture(root, "menubar", MenubarFixture, {})
  const page = window as unknown as {
    __serverHtml: string
    __serverMarkup: string
  }
  page.__serverMarkup = page.__serverHtml
}

export { mount }
