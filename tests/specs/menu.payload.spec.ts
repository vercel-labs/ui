import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// One menu that two triggers share, each with a payload. A trigger that takes
// the open menu over changes the payload with no open change, so `payloadchange`
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
  await page.getByRole("button", { name: "Roadmap" }).click()
  await expect(lastPayload(page)).toHaveText("menu payload roadmap: Roadmap")
  await expect(lastOpen(page)).toHaveText("menu open: Roadmap")
  await expect(page.getByRole("menu")).toContainText("Actions for roadmap")
})

test("a screen reader's click on another trigger hands the open menu over with its payload, without reopening it", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Roadmap" }).click()
  await page
    .getByRole("button", { name: "Budget" })
    .evaluate((el) => (el as HTMLElement).click())
  await expect(lastPayload(page)).toHaveText("menu payload budget: Budget")
  await expect(lastOpen(page)).toHaveText("menu open: Roadmap")
  await expect(page.getByRole("menu")).toContainText("Actions for budget")
  await expect(page.getByRole("button", { name: "Budget" })).toHaveAttribute(
    "aria-expanded",
    "true"
  )
})

test("pressing another trigger while the menu is open shows that trigger's payload", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Roadmap" }).click()
  await page.getByRole("button", { name: "Budget" }).click()
  await expect(lastPayload(page)).toHaveText("menu payload budget: Budget")
  await expect(page.getByRole("menu")).toContainText("Actions for budget")
})

test("pressing another trigger with the pointer hands the open menu over without reopening it", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Roadmap" }).click()
  await expect(lastOpen(page)).toHaveText("menu open: Roadmap")
  await page.getByRole("button", { name: "Budget" }).click()
  await expect(lastPayload(page)).toHaveText("menu payload budget: Budget")
  await expect(page.getByRole("button", { name: "Budget" })).toHaveAttribute(
    "aria-expanded",
    "true"
  )
  await expect(page.getByRole("menu")).toBeVisible()
  await expect(lastOpen(page)).toHaveText("menu open: Roadmap")
})
