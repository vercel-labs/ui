import { expect, test } from "../fixtures"

// Right to left, the indicator fills from the right.

test("the indicator starts at the right edge of the track", async ({
  page,
  open,
}) => {
  await open("progress", { dir: "rtl" })
  const upload = page.getByRole("progressbar", { name: "Uploading" })
  const track = (await upload.locator(".gauge-track").boundingBox())!
  const indicator = (await upload.locator(".gauge-indicator").boundingBox())!
  expect(Math.round(indicator.x + indicator.width)).toBe(
    Math.round(track.x + track.width)
  )
  expect(Math.round(indicator.width)).toBe(Math.round(track.width * 0.4))
})
