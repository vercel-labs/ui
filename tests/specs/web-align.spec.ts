import { expect, test } from "../fixtures"

// `align` places a web root, like a toast region or a carousel's slides, and
// leaves its text alone. Chromium and WebKit read `align` on any element as a
// legacy text alignment otherwise.

test.beforeEach(({ framework }) => {
  test.skip(!framework.startsWith("web"), "Only web components have `align`.")
})

for (const [fixture, tag] of [
  ["toast", "ui-toast-region"],
  ["carousel", "ui-carousel"],
] as const) {
  test(`<${tag} align> keeps its text's alignment`, async ({ page, open }) => {
    await open(fixture)
    const aligns = await page.evaluate((tag) => {
      return ["end", "center"].map((align) => {
        const root = document.createElement(tag)
        root.setAttribute("align", align)
        root.innerHTML = "<p>Text</p>"
        document.body.append(root)
        const value = getComputedStyle(root.querySelector("p")!).textAlign
        root.remove()
        return value
      })
    }, tag)
    expect(aligns).toEqual(["start", "start"])
  })
}
