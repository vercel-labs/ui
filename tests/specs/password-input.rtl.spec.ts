import { buttonNamed, expect, test } from "../fixtures"
import { passwordInputFixture } from "../fixtures/password-input"

// Right-to-left pages keep the caret where it was too.

const { password } = passwordInputFixture

test("showing the password keeps the caret in a right-to-left page @enhancement", async ({
  page,
  open,
}) => {
  await open("password-input", { dir: "rtl" })
  const field = page.getByLabel(password.label, { exact: true })
  await field.fill("שלום עולם")
  await field.evaluate((el) => (el as HTMLInputElement).setSelectionRange(4, 4))
  await buttonNamed(page, password.toggle).click()
  await expect(field).toHaveAttribute("type", "text")
  await expect(field).toBeFocused()
  await expect
    .poll(() =>
      field.evaluate((el) => [
        (el as HTMLInputElement).selectionStart,
        (el as HTMLInputElement).selectionEnd,
      ])
    )
    .toEqual([4, 4])
})
