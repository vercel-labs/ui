import { expect, type Locator } from "@playwright/test"
import { type Check, testExamples } from "./docs-helpers"

// The newest line in an example's console.
const lastLog = (preview: Locator) =>
  preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()

const height = async (box: Locator) => (await box.boundingBox())!.height

// Runs each check in the preview it belongs to, so a page reorder fails loudly.
const scoped = (checks: Record<string, Check>) =>
  Object.fromEntries(
    Object.entries(checks).map(([name, check]): [string, Check] => [
      name,
      async (preview, framework) => {
        await expect(preview).toHaveAttribute("data-example", `textarea/${name}`)
        await check(preview, framework)
      },
    ]),
  )

testExamples(
  "textarea",
  scoped({
    basic: async (preview) => {
      const message = preview.getByRole("textbox", { name: "Message" })
      await preview.getByText("Message", { exact: true }).click()
      await expect(message).toBeFocused()
      await message.pressSequentially("Hi Hollis,")
      await message.press("Enter")
      await message.pressSequentially("See you Friday.")
      await expect(message).toHaveValue("Hi Hollis,\nSee you Friday.")
    },
    field: async (preview) => {
      const feedback = preview.getByRole("textbox", { name: "Feedback" })
      await expect(feedback).toHaveAccessibleDescription("Only the product team can see this.")
      await feedback.fill("Faster checkout, please.")
      await expect(feedback).toHaveValue("Faster checkout, please.")
    },
    "auto-resize": async (preview) => {
      const notes = preview.getByRole("textbox", { name: "Notes" })
      const empty = await height(notes)
      await notes.fill("Gate code 4417.\nLeave it with the front desk.\nRing twice.\nThank you!")
      await expect.poll(() => height(notes)).toBeGreaterThan(empty)
      await notes.fill(Array.from({ length: 12 }, (_, line) => `Line ${line + 1}`).join("\n"))
      await expect.poll(() => notes.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true)
      const tallest = await height(notes)
      await notes.fill("Gate code 4417.")
      await expect.poll(() => height(notes)).toBeLessThan(tallest)
      await expect.poll(() => height(notes)).toBe(empty)
    },
    controlled: async (preview) => {
      const bio = preview.getByRole("textbox", { name: "Bio" })
      await expect(preview.getByText("62 / 160 characters")).toBeVisible()
      await bio.fill("Designer.")
      await expect(preview.getByText("9 / 160 characters")).toBeVisible()
      await bio.fill("x".repeat(200))
      await expect(bio).toHaveValue("x".repeat(160))
    },
    button: async (preview) => {
      const message = preview.getByRole("textbox", { name: "Message" })
      const send = preview.getByRole("button", { name: "Send Message" })
      await send.click()
      await expect(message).toBeFocused()
      await message.fill("On my way.")
      await send.click()
      await expect(lastLog(preview)).toHaveText("Sent “On my way.”")
      await expect(message).toHaveValue("")
    },
    disabled: async (preview) => {
      const reply = preview.getByRole("textbox", { name: "Reply" })
      await expect(reply).toBeDisabled()
      await expect(reply).toHaveValue("Replies are closed for this thread.")
    },
    invalid: async (preview) => {
      const review = preview.getByRole("textbox", { name: "Review" })
      await expect(review).toHaveAttribute("aria-invalid", "true")
      await expect(review).toHaveAccessibleDescription("Write at least 20 characters.")
    },
  }),
  "components",
  ["basic", "field", "auto-resize", "controlled", "button", "disabled", "invalid", "rtl"],
)
