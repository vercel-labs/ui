import { expect, test } from "../fixtures"

// Opens every scroll area kitchen sink variant, scrolls each one that
// overflows to its end, then streams into the sticking chat. The page is for
// manual testing, so this only proves every variant renders and responds
// without errors. Checks are soft, so one run lists every variant that misbehaves.
test("every scroll area kitchen sink variant renders and scrolls", async ({
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

  await page.goto(`/?fixture=scroll-area-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  const cards = page.locator("[data-variant]")
  await expect(cards.first()).toBeVisible()
  // Each card mounts its own root, so wait for all of them.
  await expect
    .poll(() =>
      page
        .locator("[data-variant]:not(:has([data-slot='scroll-area-root']))")
        .count()
    )
    .toBe(0)

  for (const card of await cards.all()) {
    const id = await card.getAttribute("data-variant")
    const root = card.locator("[data-slot='scroll-area-root']")
    const viewport = card.locator("[data-slot='scroll-area-viewport']")
    await card.scrollIntoViewIfNeeded()
    await expect.soft(root, `${id} renders`).toBeVisible()
    if ((await card.getAttribute("data-overflows")) !== "true") {
      await expect
        .soft(root, `${id} fits`)
        .not.toHaveAttribute("data-overflow-y")
      continue
    }
    await viewport.evaluate((el) =>
      el.scrollTo({
        top: 1e6,
        left: el.matches(":dir(rtl)") ? -1e6 : 1e6,
        behavior: "instant",
      })
    )
    await expect
      .soft(root, `${id} reaches the end`)
      .toHaveAttribute("data-at-end", "")
  }

  // Streaming into the sticking chat keeps its end in view.
  const chat = page.locator('[data-variant="stick-chat"]')
  await chat.scrollIntoViewIfNeeded()
  for (let index = 0; index < 3; index++) {
    await chat.getByRole("button", { name: "add message" }).click()
  }
  await expect(chat.locator("[data-slot='scroll-area-root']")).toHaveAttribute(
    "data-at-end",
    ""
  )
  await chat.getByRole("button", { name: "scrollToStart()" }).click()
  await expect(chat.locator("[data-slot='scroll-area-root']")).toHaveAttribute(
    "data-at-start",
    ""
  )
  await expect(
    chat.getByRole("button", { name: "Jump to latest" })
  ).toHaveAttribute("data-visible", "")

  expect(errors).toEqual([])
})
