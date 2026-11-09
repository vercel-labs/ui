import { expect, test } from "../fixtures"

// Right to left, the indicator fills from the right.

test("the indicator starts at the right edge of the track", async ({
  page,
  open,
}) => {
  await open("meter", { dir: "rtl" })
  const storage = page.getByRole("meter", { name: "Storage" })
  const track = (await storage.locator(".gauge-track").boundingBox())!
  const indicator = (await storage.locator(".gauge-indicator").boundingBox())!
  expect(Math.round(indicator.x + indicator.width)).toBe(
    Math.round(track.x + track.width)
  )
  expect(Math.round(indicator.width)).toBe(Math.round(track.width * 0.6))
})
