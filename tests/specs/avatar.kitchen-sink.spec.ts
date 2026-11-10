import { expect, test } from "../fixtures"

// Opens every avatar kitchen sink variant and waits for its first avatar to
// settle, then drives the source buttons. The page is for manual testing, so
// this only proves every variant renders and responds without errors. Checks
// are soft, so one run lists every variant that misbehaves.
test("every avatar kitchen sink variant renders and settles", async ({
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
  // The broken image's 404 is expected, so only other errors count.
  page.on(
    "console",
    (message) =>
      message.type() === "error" &&
      !message.text().includes("404") &&
      errors.push(message.text())
  )

  await page.goto(`/?fixture=avatar-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  const cards = page.locator("[data-variant]")
  await expect(cards.first()).toBeVisible()
  // Each card mounts its own root, so wait for all of them.
  await expect
    .poll(() =>
      page.locator('[data-variant]:not(:has([data-slot="avatar"]))').count()
    )
    .toBe(0)

  for (const card of await cards.all()) {
    const id = await card.getAttribute("data-variant")
    const settles = (await card.getAttribute("data-settles"))!
    const avatar = card.locator('[data-slot="avatar"]').first()
    await card.scrollIntoViewIfNeeded()
    await expect
      .soft(avatar, `${id} settles`)
      .toHaveAttribute("data-loading-status", settles)
    // A loaded image shows and the fallback goes; otherwise the fallback shows once its delay passes.
    if (settles === "loaded") {
      await expect
        .soft(avatar.locator("img"), `${id} shows its image`)
        .toBeVisible()
      // Web components keep a hidden fallback in the page, so this checks it isn't visible.
      await expect
        .soft(
          avatar.locator('[data-slot="avatar-fallback"]'),
          `${id} hides its fallback`
        )
        .toBeHidden()
    } else {
      await expect
        .soft(
          avatar.locator('[data-slot="avatar-fallback"]'),
          `${id} falls back`
        )
        .toBeVisible()
    }
  }

  // The source buttons walk the first avatar through every status.
  const steps = [
    ["src: Grace", "loaded"],
    ["src: broken", "error"],
    ["remove src", "error"],
    ["remove image", "idle"],
    ["src: Ada", "loaded"],
  ]
  for (const id of ["sources", "sources-none", "sources-delay"]) {
    const card = page.locator(`[data-variant="${id}"]`)
    const avatar = card.locator('[data-slot="avatar"]')
    await card.scrollIntoViewIfNeeded()
    for (const [label, status] of steps) {
      await card.getByRole("button", { name: label, exact: true }).click()
      await expect
        .soft(avatar, `${id} after ${label}`)
        .toHaveAttribute("data-loading-status", status)
      const fallback = card.locator('[data-slot="avatar-fallback"]')
      await (status === "loaded"
        ? expect.soft(fallback).toBeHidden()
        : expect.soft(fallback).toBeVisible())
    }
  }

  expect(errors).toEqual([])
})
