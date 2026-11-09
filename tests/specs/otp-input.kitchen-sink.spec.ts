import { expect, test } from "../fixtures"

// Types into every OTP input kitchen sink variant and checks the code it
// holds and the slots drawn from it. The page is for manual testing, so this
// only proves every variant renders and responds without errors. Checks are
// soft, so one run lists every variant that misbehaves.
test("every OTP input kitchen sink variant takes a code", async ({
  page,
  framework,
}) => {
  test.skip(
    !["react", "vue", "web"].includes(framework),
    "Composition frameworks only."
  )
  test.setTimeout(120_000)
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on(
    "console",
    (message) => message.type() === "error" && errors.push(message.text())
  )

  await page.goto(`/?fixture=otp-input-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  const cards = page.locator("[data-variant]")
  await expect(cards.first()).toBeVisible()
  // Each card mounts its own root, so wait for all of them.
  await expect
    .poll(() => page.locator("[data-variant]:not(:has(input))").count())
    .toBe(0)

  for (const card of await cards.all()) {
    const id = await card.getAttribute("data-variant")
    const typed = (await card.getAttribute("data-type"))!
    const expected = (await card.getAttribute("data-expect"))!
    const input = card.locator("input")
    await card.scrollIntoViewIfNeeded()
    // Keys go to the focused element, so nothing stays focused from the last card.
    await page.evaluate(() =>
      (document.activeElement as HTMLElement | null)?.blur()
    )
    if (typed && (await input.isEnabled())) {
      await input.focus()
      await page.keyboard.type(typed)
    }
    await expect.soft(input, `${id} holds its code`).toHaveValue(expected)
    if (
      (await card.getAttribute("data-masked")) === null ||
      framework === "web"
    ) {
      await expect
        .poll(
          async () =>
            (
              await card
                .locator('[data-slot="otp-input-slot"]')
                .allTextContents()
            ).join(""),
          {
            message: `${id} draws its code`,
          }
        )
        .toBe(expected)
    }
  }

  const log = page.locator("[data-log]")
  await expect(log).toContainText('length-6 complete "123456"')
  await expect(log).not.toContainText('canceled valueChange "19')

  // A wrong code turns the verified variant invalid.
  await expect(page.locator('[data-variant="verify"] input')).toHaveAttribute(
    "aria-invalid",
    "true"
  )

  // The controller and controlled buttons set and clear the code.
  const controller = page.locator('[data-variant="controller"]')
  await controller.getByRole("button", { name: "clear()" }).click()
  await expect(controller.locator("input")).toHaveValue("")
  await controller.getByRole("button", { name: "setValue(123456)" }).click()
  await expect(controller.locator("input")).toHaveValue("123456")
  const controlled = page.locator('[data-variant="controlled"]')
  await controlled.getByRole("button", { name: "clear" }).click()
  await expect(controlled.locator("input")).toHaveValue("")
  await controlled.getByRole("button", { name: "set 123456" }).click()
  await expect(controlled.locator("input")).toHaveValue("123456")

  // The required form submits a full code and resets to empty.
  const form = page.locator('[data-variant="form-required"]')
  await form.getByRole("button", { name: "Submit" }).click()
  await expect(log).toContainText("form-required submit code=123456")
  await form.getByRole("button", { name: "Reset" }).click()
  await expect(form.locator("input")).toHaveValue("")
  await form.getByRole("button", { name: "Submit" }).click()
  await expect(log).toContainText("form-required invalid:")
  const reset = page.locator('[data-variant="form-default"]')
  await reset.locator("input").focus()
  await page.keyboard.press("Backspace")
  await expect(reset.locator("input")).toHaveValue("424")
  await reset.getByRole("button", { name: "Reset" }).click()
  await expect(reset.locator("input")).toHaveValue("4242")

  expect(errors).toEqual([])
})
