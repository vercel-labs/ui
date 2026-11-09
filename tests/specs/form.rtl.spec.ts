import { expect, test } from "../fixtures"
import { textbox } from "./form.helpers"

// Text fields follow the page's direction.

test(
  "an input group lays out from the right, and its clear button still works",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("form", { dir: "rtl" })
    await textbox(page, "Website").fill("example.com")
    const prefix = await page.getByText("https://").boundingBox()
    const field = await textbox(page, "Website").boundingBox()
    expect(prefix!.x).toBeGreaterThan(field!.x)
    await page.getByRole("button", { name: "Clear website" }).click()
    await expect(textbox(page, "Website")).toHaveValue("")
    await expect(textbox(page, "Website")).toBeFocused()
  }
)
