import { expect, type Locator } from "@playwright/test"
import { testExamples, type Check } from "./docs-helpers"

// The newest line in an example's console.
const lastLog = (preview: Locator) =>
  preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()

// The options of the example's list.
const option = (preview: Locator, name: string) => preview.getByRole("option", { name, exact: true })

// Presses an option and checks it's selected.
const selects =
  (name: string): Check =>
  async (preview) => {
    await option(preview, name).click()
    await expect(option(preview, name)).toHaveAttribute("aria-selected", "true")
  }

// Each example's check, in the order they appear on the Listbox page.
const checks: Record<string, Check> = {
  basic: async (preview) => {
    await expect(preview.getByRole("listbox", { name: "Email me about" })).toBeVisible()
    await expect(option(preview, "Mentions")).toHaveAttribute("aria-selected", "true")
    // A click replaces the selection, and Shift selects the range from it.
    await option(preview, "Comments").click()
    await expect(option(preview, "Mentions")).toHaveAttribute("aria-selected", "false")
    await option(preview, "New sign-ins").click({ modifiers: ["Shift"] })
    for (const name of ["Comments", "Mentions", "Reactions", "New sign-ins"])
      await expect(option(preview, name)).toHaveAttribute("aria-selected", "true")
    await expect(option(preview, "Billing")).toHaveAttribute("aria-selected", "false")
  },
  multiple: async (preview) => {
    await option(preview, "Basil").click()
    await expect(lastLog(preview)).toHaveText("cheese, onion, basil (item-press)")
  },
  activation: async (preview) => {
    await option(preview, "index.ts").click()
    // A click replaces the selection.
    await expect(lastLog(preview)).toHaveText("1 selected (item-press)")
  },
  manual: async (preview) => {
    await selects("Nuxt")(preview, "")
    await expect(lastLog(preview)).toHaveText("nuxt (item-press)")
  },
  deselectable: async (preview) => {
    await option(preview, "Astro").click()
    await expect(lastLog(preview)).toHaveText("Nothing (item-press)")
  },
  groups: async (preview) => {
    await expect(preview.getByRole("group", { name: "Vegetables" })).toBeVisible()
    await selects("Carrot")(preview, "")
  },
  icons: selects("Drafts"),
  horizontal: async (preview) => {
    await expect(option(preview, "M")).toHaveAttribute("aria-selected", "true")
    await selects("L")(preview, "")
  },
  disabled: async (preview) => {
    await option(preview, "Olive").click({ force: true })
    await expect(option(preview, "Olive")).toHaveAttribute("aria-selected", "false")
  },
  "read-only": async (preview) => {
    await option(preview, "Astro").click()
    await expect(option(preview, "Nuxt")).toHaveAttribute("aria-selected", "true")
  },
  form: async (preview) => {
    await option(preview, "Basil").click()
    await preview.getByRole("button", { name: "Order" }).click()
    await expect(lastLog(preview)).toHaveText("Ordered cheese, basil")
  },
  data: async (preview) => {
    await expect(option(preview, "Pro")).toHaveAttribute("aria-selected", "true")
    await option(preview, "Team").click()
    await expect(lastLog(preview)).toHaveText("team, $50 a month")
  },
  controller: async (preview) => {
    await preview.getByRole("button", { name: "Select All" }).click()
    await expect(option(preview, "Pepper")).toHaveAttribute("aria-selected", "true")
    await preview.getByRole("button", { name: "Clear" }).click()
    await expect(option(preview, "Pepper")).toHaveAttribute("aria-selected", "false")
  },
  scrollable: async (preview) => {
    await expect(option(preview, "UTC+09:00")).toHaveAttribute("aria-selected", "true")
  },
  render: async (preview) => {
    await option(preview, "Remix").click()
    await expect(option(preview, "Remix")).toHaveAttribute("aria-selected", "true")
    await expect(preview.page()).toHaveURL(/#remix$/)
  },
}

testExamples("listbox", checks, "components", [...Object.keys(checks), "rtl"])
