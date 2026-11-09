import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// One popover that two triggers share, each with a payload. A trigger that takes
// the open popover over changes the payload with no open change, so `payloadchange`
// (`onPayloadChange`, `@payload-change`) is how content outside a framework hears it.

const lastOpen = (page: Page) => page.getByRole("status", { name: "Last open" })
const lastPayload = (page: Page) =>
  page.getByRole("status", { name: "Last payload" })

test.beforeEach(async ({ open }) => {
  await open("popup-payloads")
})

test("opening reports the trigger's payload, and the content shows it", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Ada" }).click()
  await expect(lastPayload(page)).toHaveText("popover payload ada: Ada")
  await expect(lastOpen(page)).toHaveText("popover open: Ada")
  await expect(page.getByRole("dialog")).toContainText("Actions for ada")
})

test("a screen reader's click on another trigger hands the open popover over with its payload, without reopening it", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Ada" }).click()
  await page
    .getByRole("button", { name: "Grace" })
    .evaluate((el) => (el as HTMLElement).click())
  await expect(lastPayload(page)).toHaveText("popover payload grace: Grace")
  await expect(lastOpen(page)).toHaveText("popover open: Ada")
  await expect(page.getByRole("dialog")).toContainText("Actions for grace")
  await expect(page.getByRole("button", { name: "Grace" })).toHaveAttribute(
    "aria-expanded",
    "true"
  )
})

test("pressing another trigger while the popover is open shows that trigger's payload", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Ada" }).click()
  await page.getByRole("button", { name: "Grace" }).click()
  await expect(lastPayload(page)).toHaveText("popover payload grace: Grace")
  await expect(page.getByRole("dialog")).toContainText("Actions for grace")
})

test("pressing another trigger with the pointer hands the open popover over without reopening it", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Ada" }).click()
  await expect(lastOpen(page)).toHaveText("popover open: Ada")
  await page.getByRole("button", { name: "Grace" }).click()
  await expect(lastPayload(page)).toHaveText("popover payload grace: Grace")
  await expect(page.getByRole("button", { name: "Grace" })).toHaveAttribute(
    "aria-expanded",
    "true"
  )
  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(lastOpen(page)).toHaveText("popover open: Ada")
})

test("a controller opening the open popover with another payload replaces it, without reopening it", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Ada" }).click()
  await page.getByRole("button", { name: "Show Linus" }).click()
  await expect(lastPayload(page)).toHaveText("popover payload linus: no target")
  await expect(lastOpen(page)).toHaveText("popover open: Ada")
  await expect(page.getByRole("dialog")).toContainText("Actions for linus")
  // The content stays with the trigger that opened it.
  await expect(page.getByRole("button", { name: "Ada" })).toHaveAttribute(
    "aria-expanded",
    "true"
  )
})

test("focus moving to another trigger without a press still closes the open popover", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Ada" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.getByRole("button", { name: "Grace" }).focus()
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(page.getByRole("button", { name: "Grace" })).toHaveAttribute(
    "aria-expanded",
    "false"
  )
})
