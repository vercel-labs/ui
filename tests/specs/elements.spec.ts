import { expect, test } from "../fixtures"

// Web components follow changes made after they connect: attributes on the
// native elements they wrap, a replaced child, and parts whose props come
// from the elements around them.
test.beforeEach(({ framework }) => {
  test.skip(framework !== "web", "Custom elements only.")
})

test("an input's data attributes follow its native disabled, readonly and required", async ({
  page,
  open,
}) => {
  await open("form")
  const input = page.locator("#username > input")
  await expect(input).toHaveAttribute("data-required", "")
  await input.evaluate((el) => el.setAttribute("readonly", ""))
  await expect(input).toHaveAttribute("data-readonly", "")
  await input.evaluate((el) => el.toggleAttribute("required", false))
  await expect(input).not.toHaveAttribute("data-required")
  await input.evaluate((el) => el.removeAttribute("readonly"))
  await expect(input).not.toHaveAttribute("data-readonly")
})

test("a button's replaced child binds in its place", async ({ page, open }) => {
  await open("toggle")
  await page.locator("#submit").evaluate((host) => {
    const button = document.createElement("button")
    button.textContent = "Send"
    host.replaceChildren(button)
  })
  await expect(page.getByRole("button", { name: "Send" })).toHaveAttribute("type", "button")
  await page.locator("#submit").evaluate((host) => host.setAttribute("disabled", ""))
  await expect(page.getByRole("button", { name: "Send" })).toBeDisabled()
  await expect(page.getByRole("button", { name: "Send" })).toHaveAttribute("data-disabled", "")
})

test("a button keeps a type its author changed later", async ({ page, open }) => {
  await open("toggle")
  const submit = page.getByRole("button", { name: "Submit" })
  await expect(submit).toHaveAttribute("type", "submit")
  await submit.evaluate((el) => el.setAttribute("type", "button"))
  await page.locator("#submit").evaluate((host) => host.setAttribute("disabled", ""))
  await page.locator("#submit").evaluate((host) => host.removeAttribute("disabled"))
  await expect(submit).toBeEnabled()
  await expect(submit).toHaveAttribute("type", "button")
})

test("a radio indicator follows its radio's new value", async ({ page, open }) => {
  await open("forms")
  const radio = page.getByRole("radio", { name: "Pro" })
  await page.locator('ui-radio[value="pro"]').evaluate((el) => el.setAttribute("value", "professional"))
  await radio.click()
  await expect(radio).toBeChecked()
  await expect(page.locator('ui-radio[value="professional"] ui-radio-indicator')).toBeVisible()
})

test("an OTP input with a pattern that doesn't compile takes digits instead of throwing", async ({
  page,
  open,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await open("otp-input")
  const code = page.getByRole("textbox", { name: "Verification code" })
  await page
    .locator("ui-otp-input")
    .first()
    .evaluate((el) => el.setAttribute("pattern", "["))
  await code.focus()
  await page.keyboard.type("1a2")
  await expect(code).toHaveValue("12")
  expect(errors).toEqual([])
})

test("ARIA set on an OTP input or a slider thumb later reaches the input that takes focus", async ({
  page,
  open,
}) => {
  await open("otp-input")
  const code = page.getByRole("textbox", { name: "Verification code" })
  await page
    .locator("ui-otp-input")
    .first()
    .evaluate((el) => el.setAttribute("aria-invalid", "true"))
  await expect(code).toHaveAttribute("aria-invalid", "true")
  await open("slider")
  // The range's first thumb, named by its own label.
  await page
    .locator("ui-slider-thumb")
    .nth(1)
    .evaluate((el) => el.setAttribute("aria-label", "Lowest"))
  await expect(page.getByRole("slider", { name: "Lowest" })).toBeVisible()
})

// Svelte and custom elements can bind an arrow after its popup was placed. The
// arrows here are absolute from the start, so the popup's size never changes.
for (const name of ["popover", "combobox", "autocomplete"])
  for (const animation of ["none", "running", "paused", "finished"])
    test(`${name}: an arrow replaced by one the same size is placed, with animation: ${animation}`, async ({
      page,
      open,
    }) => {
      await open(name)
      await page.locator(`ui-${name}-trigger button`).first().click()
      const content = page.locator(`ui-${name}-content`).first()
      await expect(content).toBeVisible()
      const side = (id: string) => content.locator(`[id="${id}"]`).getAttribute("data-side")
      const addArrow = (id: string) =>
        content.evaluate(
          (el, { name, id }) => {
            const arrow = document.createElement(`ui-${name}-arrow`)
            arrow.id = id
            arrow.style.cssText = "position: absolute; display: block; width: 10px; height: 10px"
            const old = el.querySelector(`ui-${name}-arrow`)
            if (old) old.replaceWith(arrow)
            else el.prepend(arrow)
          },
          { name, id },
        )
      await addArrow("first")
      await expect.poll(() => side("first")).not.toBeNull()
      await content.evaluate(async (el, animation) => {
        if (animation === "none") return
        const running = el.animate([{ opacity: 0.9 }, { opacity: 1 }], {
          duration: animation === "finished" ? 1 : 60_000,
          fill: "forwards",
        })
        running.id = "probe"
        if (animation === "paused") running.pause()
        if (animation === "finished") await running.finished
      }, animation)
      await addArrow("second")
      await expect.poll(() => side("second")).not.toBeNull()
      const playState = await content.evaluate(
        (el) => el.getAnimations().find((running) => running.id === "probe")?.playState ?? "none",
      )
      expect(playState).toBe(animation)
    })
