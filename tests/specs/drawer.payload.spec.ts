import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// One non-modal drawer that two triggers share, each with a payload. Pressing
// the other trigger while it's open takes it over with no open change, so
// `payloadchange` (`onPayloadChange`, `@payload-change`) is how content outside
// a framework hears it.

const lastOpen = (page: Page) => page.getByRole("status", { name: "Last open" })
const lastPayload = (page: Page) =>
  page.getByRole("status", { name: "Last payload" })

test.beforeEach(async ({ open }) => {
  await open("popup-payloads")
})

test("opening reports the trigger's payload, and the content shows it", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Photo 1" }).click()
  await expect(lastPayload(page)).toHaveText("drawer payload photo 1: Photo 1")
  await expect(lastOpen(page)).toHaveText("drawer open: Photo 1")
  await expect(page.getByRole("dialog")).toHaveText("Actions for photo 1")
})

test("pressing another trigger hands the open drawer over with its payload, without reopening it", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Photo 1" }).click()
  await page.getByRole("button", { name: "Photo 2" }).click()
  await expect(lastPayload(page)).toHaveText("drawer payload photo 2: Photo 2")
  await expect(lastOpen(page)).toHaveText("drawer open: Photo 1")
  await expect(page.getByRole("dialog")).toHaveText("Actions for photo 2")
  await expect(page.getByRole("button", { name: "Photo 2" })).toHaveAttribute(
    "aria-expanded",
    "true"
  )
})
