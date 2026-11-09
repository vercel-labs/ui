import { expect, test } from "../fixtures"
import { focusCode, shownCode } from "./otp-input.helpers"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("a code hydrates without mismatches and takes typing", async ({
  page,
  open,
}) => {
  await open("otp-input", { default: "12" })
  await page.waitForLoadState("networkidle")
  await expect.poll(() => shownCode(page)).toBe("12")
  await focusCode(page)
  await page.keyboard.press("End")
  await page.keyboard.type("34")
  await expect.poll(() => shownCode(page)).toBe("1234")
  expect(await hydrationErrors(page)).toEqual([])
})
