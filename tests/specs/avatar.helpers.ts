import type { Page, Request } from "@playwright/test"
import { avatarPng } from "../fixtures/avatar"

// Serves the fixture's images: every one loads except missing.png, and
// slow.png and the next image wait `slowMs` first. Unless `cacheable`,
// responses can't be cached, so every fetch reaches here. Returns the
// requests seen, by path.
async function routeAvatars(
  page: Page,
  { slowMs = 1500, cacheable = false } = {}
) {
  const requests = new Map<string, Request[]>()
  await page.route("**/avatars/*", async (route) => {
    const path = new URL(route.request().url()).pathname
    requests.set(path, [...(requests.get(path) ?? []), route.request()])
    if (path.endsWith("missing.png")) {
      return route.fulfill({ status: 404 })
    }
    if (path.endsWith("slow.png") || path.endsWith("ada-2.png")) {
      await new Promise((resolve) => setTimeout(resolve, slowMs))
    }
    await route.fulfill({
      status: 200,
      contentType: "image/png",
      headers: {
        "cache-control": cacheable ? "max-age=3600" : "no-store",
        "access-control-allow-origin": "*",
      },
      body: Buffer.from(avatarPng, "base64"),
    })
  })
  return requests
}

// The avatars in fixture order: Ada, Grace, Alan, Katherine, Hedy.
function avatarAt(page: Page, index: number) {
  return page.locator(".avatar").nth(index)
}

// An avatar's fallback, by its initials. Web components keep it in the page, hidden.
function fallbackOf(page: Page, index: number, initials: string) {
  return avatarAt(page, index).getByText(initials, { exact: true })
}

export { avatarAt, fallbackOf, routeAvatars }
