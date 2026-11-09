import { expect, test } from "../fixtures"

// Web component popups take `container` on their content too, as React and
// Vue take it on the content part.

test.beforeEach(({ framework }) => {
  test.skip(
    !framework.startsWith("web"),
    "Only web components read the container from an attribute."
  )
})

for (const [fixture, name] of [
  ["tooltip", "tooltip"],
  ["popover", "popover"],
  ["hover-card", "hover-card"],
] as const) {
  test(`<ui-${name}-content container> renders the open ${name} there`, async ({
    page,
    open,
  }) => {
    await open(fixture)
    await page.evaluate((name) => {
      const box = document.createElement("div")
      box.id = "content-box"
      const root = document.createElement(`ui-${name}`) as HTMLElement &
        Record<string, any>
      root.id = "own-container"
      root.innerHTML = `<ui-${name}-trigger><button>Own container</button></ui-${name}-trigger><ui-${name}-content container="#content-box">Inside the box</ui-${name}-content>`
      document.body.append(root, box)
      setTimeout(() => root.api.open())
    }, name)
    await expect(page.locator(`#content-box ui-${name}-content`)).toHaveText(
      "Inside the box"
    )
  })
}
