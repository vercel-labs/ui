import { expect, type Page } from "@playwright/test"

// Opens a docs page, fails the test on any page error, and waits for every
// live example on it to render.
async function openExamples(page: Page, url: string) {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text())
    }
  })
  await page.goto(url)
  const examples = page.locator("[data-example]")
  await expect(examples.first()).toBeVisible()
  for (const example of await examples.all()) {
    await expect(example.locator("*").first()).toBeVisible()
  }
  return { errors }
}

// Opens a Behaviors page.
const openBehaviors = (page: Page, name: string) =>
  openExamples(page, `/docs/core/behaviors/${name}`)

export { openBehaviors, openExamples }
