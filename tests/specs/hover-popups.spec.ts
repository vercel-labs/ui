import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// What popups that open on hover report when the pointer moves straight from
// one element to the next: the event behind a change is the one at the
// element the pointer entered, never the one it left, and a shared popup that
// moves to another trigger reports that trigger's payload.

const lastChange = (page: Page) =>
  page.getByRole("status", { name: "Last change" })

test.beforeEach(async ({ open }) => {
  await open("hover-popups")
})

test("a tooltip opens with the event at its trigger, not at the element the pointer left", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Before" }).hover()
  await page.getByRole("button", { name: "Mon" }).hover()
  await expect(lastChange(page)).toHaveText("tooltip open: Mon")
})

test("moving to another trigger of an open tooltip reports its payload, with the event at that trigger", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Mon" }).hover()
  await expect(lastChange(page)).toHaveText("tooltip open: Mon")
  await page.getByRole("button", { name: "Tue" }).hover()
  await expect(lastChange(page)).toHaveText("tooltip payload tue: Tue")
  await expect(page.getByRole("tooltip")).toHaveText("Tip for tue")
})

test("a hover card opens with the event at its link, and reports the payload of the next link", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Before" }).hover()
  await page.getByRole("link", { name: "Ada" }).hover()
  await expect(lastChange(page)).toHaveText("hover card open: Ada")
  await page.getByRole("link", { name: "Grace" }).hover()
  await expect(lastChange(page)).toHaveText("hover card payload grace: Grace")
  await expect(page.getByText("Card for grace")).toBeVisible()
})

test("a popover that opens on hover opens with the event at its trigger", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Before" }).hover()
  await page.getByRole("button", { name: "Settings" }).hover()
  await expect(lastChange(page)).toHaveText("popover open: Settings")
})
