import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "../fixtures"

async function audit(page: import("@playwright/test").Page) {
  // Page structure rules are about the fixture page, not the components.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

test("no axe violations at rest", async ({ page, open }) => {
  await open("progress")
  expect(await audit(page)).toEqual([])
})

test("no axe violations when complete", async ({ page, open }) => {
  await open("progress")
  for (let step = 0; step < 3; step++) {
    await page.getByRole("button", { name: "Advance" }).click()
  }
  await expect(
    page.getByRole("progressbar", { name: "Uploading" })
  ).toHaveAttribute("aria-valuenow", "100")
  expect(await audit(page)).toEqual([])
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("progress")
  await expect(page.locator(".fixture")).toMatchAriaSnapshot(`
    - button "Before"
    - progressbar "Uploading"
    - progressbar "Loading"
    - progressbar "Files"
    - progressbar "Disk"
    - button "Advance"
  `)
})

test("only a bar without a label or aria-label warns in development, whatever its value text", async ({
  page,
  open,
  framework,
}) => {
  test.skip(!framework.startsWith("web"), "Adds bars through the DOM.")
  const printed: string[] = []
  page.on(
    "console",
    (message) => message.type() === "warning" && printed.push(message.text())
  )
  await open("progress")
  await page.evaluate(() => {
    const bar = (attributes: string) =>
      `<ui-progress ${attributes} value="30"><ui-progress-value></ui-progress-value></ui-progress>`
    document
      .querySelector(".fixture")!
      .insertAdjacentHTML(
        "beforeend",
        bar('id="unnamed"') + bar('aria-label="Named"')
      )
  })
  const missing = () =>
    printed.filter((text) => text.includes("Progress has no accessible name"))
  await expect.poll(() => missing().length).toBe(1)
  expect(missing()[0]).toContain("progress#unnamed")
})

test("setting a web bar's properties again doesn't add another listener", async ({
  page,
  open,
  framework,
}) => {
  test.skip(!framework.startsWith("web"), "Web components' properties.")
  await open("progress")
  const calls = await page.evaluate(async () => {
    const counts = [0, 0]
    const bars = [0, 1].map((index) => {
      const bar = document.createElement("ui-progress") as HTMLElement & {
        format?: unknown
      }
      bar.setAttribute("aria-label", `Bar ${index}`)
      bar.setAttribute("value", "10")
      bar.innerHTML = "<ui-progress-value></ui-progress-value>"
      document.querySelector(".fixture")!.append(bar)
      // The second bar gets its format five times.
      for (let set = 0; set < (index ? 5 : 1); set++) {
        bar.format = (value: number) => (counts[index]++, `${value}`)
      }
      return bar
    })
    await new Promise((resolve) => setTimeout(resolve, 50))
    counts.fill(0)
    for (const bar of bars) {
      bar.setAttribute("value", "20")
    }
    await new Promise((resolve) => setTimeout(resolve, 50))
    return counts
  })
  expect(calls[1]).toBe(calls[0])
})
