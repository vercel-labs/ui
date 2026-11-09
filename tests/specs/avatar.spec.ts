import { expect, lastAction, test } from "../fixtures"
import { avatarAction } from "../fixtures/avatar"
import { fallbackOf, routeAvatars } from "./avatar.helpers"

// An image with a fallback shown until it loads, or when it can't.

test("an image that loads replaces the fallback", async ({ page, open }) => {
  await routeAvatars(page)
  await open("avatar")
  await expect(page.getByRole("img", { name: "Ada Lovelace" })).toBeVisible()
  await expect(fallbackOf(page, 0, "AL")).toBeHidden()
})

test("an image that fails keeps the fallback", async ({ page, open }) => {
  await routeAvatars(page)
  await open("avatar")
  await expect(fallbackOf(page, 1, "GH")).toBeVisible()
  await expect(page.getByRole("img", { name: "Grace Hopper" })).toHaveCount(0)
})

test("an avatar without an image shows its fallback", async ({
  page,
  open,
}) => {
  await routeAvatars(page)
  await open("avatar")
  await expect(fallbackOf(page, 2, "AT")).toBeVisible()
})

test("a fallback with a delay waits before showing", async ({
  page,
  open,
  browserName,
}) => {
  // Firefox keeps images in a cache that test pages share, whatever the
  // headers, so the slow image may already be loaded there.
  test.skip(
    browserName === "firefox",
    "Firefox shares its image cache between test pages."
  )
  await routeAvatars(page, { slowMs: 10_000 })
  // Paused, so the delay runs only as the test advances it, whatever the load.
  await page.clock.install({ time: 0 })
  await page.clock.pauseAt(1000)
  await open("avatar")
  await page.clock.runFor(300)
  await expect(fallbackOf(page, 3, "KJ")).toBeHidden()
  await page.clock.runFor(400)
  await expect(fallbackOf(page, 3, "KJ")).toBeVisible()
})

test("the image's loading status is reported", async ({ page, open }) => {
  await routeAvatars(page)
  await open("avatar")
  await expect
    .poll(() => lastAction(page))
    .toBe(avatarAction("loaded", "image-load"))
})

test("removing the image brings the fallback back", async ({ page, open }) => {
  await routeAvatars(page)
  await open("avatar")
  await expect(page.getByRole("img", { name: "Ada Lovelace" })).toBeVisible()
  await page.getByRole("button", { name: "Remove image" }).click()
  await expect(fallbackOf(page, 0, "AL")).toBeVisible()
})

test("a new source shows its image once it loads", async ({ page, open }) => {
  await routeAvatars(page, { slowMs: 200 })
  await open("avatar")
  await expect(page.getByRole("img", { name: "Ada Lovelace" })).toBeVisible()
  await page.getByRole("button", { name: "Change image" }).click()
  await expect(page.getByRole("img", { name: "Ada Lovelace" })).toHaveAttribute(
    "src",
    "/avatars/ada-2.png"
  )
  await expect(page.getByRole("img", { name: "Ada Lovelace" })).toBeVisible()
})

test("the image is fetched with its own referrer policy", async ({
  page,
  open,
}) => {
  const requests = await routeAvatars(page)
  await open("avatar")
  await expect(page.getByRole("img", { name: "Hedy Lamarr" })).toBeVisible()
  const sent = requests.get("/avatars/private.png") ?? []
  expect(sent.length).toBeGreaterThan(0)
  for (const request of sent) {
    expect(await request.headerValue("referer")).toBeNull()
  }
})

// Counts each frame in which the first avatar's fallback was on screen, from
// before it mounts again until two frames after.
test("a cached image doesn't flash the fallback when the avatar mounts again", async ({
  page,
  open,
  browserName,
}) => {
  // Firefox decodes even a cached image after the first paint, so nothing can
  // know it's there in time. A fallback `delay` covers it.
  test.skip(
    browserName === "firefox",
    "Firefox reports cached images loaded only after a paint."
  )
  await routeAvatars(page, { cacheable: true })
  await open("avatar")
  await expect(page.getByRole("img", { name: "Ada Lovelace" })).toBeVisible()
  await page.evaluate(() => {
    const seen = { frames: 0 }
    Object.assign(window, { fallbackFrames: seen })
    const check = () => {
      const avatar = document.querySelector(".avatar")
      const fallback = avatar?.querySelector<HTMLElement>(".avatar-fallback")
      if (fallback && fallback.checkVisibility()) {
        seen.frames++
      }
    }
    let frames = 0
    const loop = () => {
      check()
      if (++frames < 30) {
        requestAnimationFrame(loop)
      }
    }
    requestAnimationFrame(loop)
  })
  await page.getByRole("button", { name: "Remount" }).click()
  await expect(page.getByRole("img", { name: "Ada Lovelace" })).toBeVisible()
  await page.waitForFunction(
    () => (window as unknown as { fallbackFrames: object }).fallbackFrames
  )
  await page.waitForTimeout(600)
  const frames = await page.evaluate(
    () =>
      (window as unknown as { fallbackFrames: { frames: number } })
        .fallbackFrames.frames
  )
  expect(frames).toBe(0)
})

test("a new source keeps showing the previous image until it loads", async ({
  page,
  open,
}) => {
  await routeAvatars(page, { slowMs: 1500 })
  await open("avatar")
  const image = page.getByRole("img", { name: "Ada Lovelace" })
  await expect(image).toBeVisible()
  await page.getByRole("button", { name: "Change image" }).click()
  // While the next image downloads, the previous one stays and the fallback doesn't come back.
  for (let check = 0; check < 5; check++) {
    await expect(image).toBeVisible()
    await expect(fallbackOf(page, 0, "AL")).toBeHidden()
    await page.waitForTimeout(150)
  }
})

test("the image is fetched once, even when it can't be cached", async ({
  page,
  open,
}) => {
  const requests = await routeAvatars(page)
  await open("avatar")
  await expect(page.getByRole("img", { name: "Ada Lovelace" })).toBeVisible()
  await page.waitForTimeout(300)
  expect(requests.get("/avatars/ada.png")?.length).toBe(1)
})
