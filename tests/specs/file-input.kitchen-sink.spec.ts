import { expect, test } from "../fixtures"
import { choose, chooseFolder, drop } from "./file-input.helpers"

// Uses every kitchen sink variant once. The page is for manual testing, so this
// only proves every variant renders, takes files, removes one and resets
// without errors.
test("every file input kitchen sink variant works", async ({
  page,
  framework,
}, testInfo) => {
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

  await page.goto(`/?fixture=file-input-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  const cards = page.locator("[data-variant]")
  await expect.poll(() => cards.count()).toBeGreaterThan(20)
  // Each card mounts its own app, so wait for every form.
  await expect
    .poll(() => page.locator("[data-variant] form").count())
    .toBe(await cards.count())

  const sample = { name: "photo.png", type: "image/png", size: 100 }
  for (let index = 0; index < (await cards.count()); index++) {
    const card = cards.nth(index)
    const name = await card.getAttribute("data-variant")
    const log = card.locator("[data-log]")
    const zone = card.locator('[data-slot="file-input-dropzone"]').first()
    const trigger = card.getByRole("button", { name: /Choose files/ })
    await card.scrollIntoViewIfNeeded()
    if (name === "parts-page") {
      await drop(card.getByRole("button", { name: "Submit" }), [sample])
      await expect(log, `${name} takes a drop anywhere`).not.toHaveText("none")
    } else if (name === "behavior-directory") {
      await chooseFolder(page, trigger, testInfo.outputPath("folder"), [
        "a.txt",
      ])
      await expect(log, `${name} takes a folder`).not.toHaveText("none")
    } else if (await zone.count()) {
      await drop(zone, [sample])
      if (name !== "behavior-disabled") {
        await expect(log, `${name} takes a drop`).not.toHaveText("none")
      }
    } else if (await trigger.isEnabled()) {
      await choose(page, trigger, [sample])
      await expect(log, `${name} takes a choice`).not.toHaveText("none")
    }
    const remove = card.getByRole("button", { name: /^Remove / }).first()
    if (name !== "behavior-disabled" && (await remove.count())) {
      await remove.click()
      await expect(log, `${name} removes a file`).toContainText("remove-press")
    }
    await card.getByRole("button", { name: "Reset" }).click()
    await card.getByRole("button", { name: "Submit" }).click()
    // Required ones hold the submit after a reset, and show why.
    if (name === "forms-field" || name === "forms-trigger-field") {
      await expect(
        card.locator('[data-slot="field-error"]'),
        `${name} blocks the submit`
      ).toBeVisible()
    } else {
      await expect(
        card.locator("[data-submitted]"),
        `${name} submits`
      ).not.toHaveText("nothing yet")
    }
  }

  expect(errors).toEqual([])
})
