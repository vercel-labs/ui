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

for (const [fixture, names] of [
  ["popover", ["popover", "menu"]],
  ["tooltip", ["tooltip"]],
  ["hover-card", ["hover-card"]],
  ["dialog", ["dialog", "alert-dialog"]],
  ["drawer", ["drawer"]],
] as const) {
  test(`the trigger of a ${names.join(" or ")} in a flex row is one of its items`, async ({
    page,
    open,
  }) => {
    await open(fixture)
    const heights = await page.evaluate(async (names) => {
      const row = document.createElement("div")
      row.style.cssText = "display: flex; height: 48px"
      row.innerHTML = names
        .map(
          (name) =>
            `<ui-${name}><ui-${name}-trigger><button>${name}</button></ui-${name}-trigger></ui-${name}>`
        )
        .join("")
      document.body.append(row)
      await new Promise(requestAnimationFrame)
      return Object.fromEntries(
        [...row.querySelectorAll("button")].map((button) => [
          button.textContent,
          button.getBoundingClientRect().height,
        ])
      )
    }, names)
    expect(heights).toEqual(Object.fromEntries(names.map((name) => [name, 48])))
  })
}
