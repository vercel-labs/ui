import { expect, test } from "../fixtures"

// Vue and Svelte write a field's value as they hydrate it. React's fields are
// covered in packages/react/test/typed-before-hydration.test.tsx.
test.beforeEach(({ framework }) => {
  test.skip(
    framework !== "vue-ssr" && framework !== "svelte-ssr",
    "Only for Vue and Svelte server-rendered fixtures."
  )
})

const fields = [
  ["combobox", "Ban"],
  ["autocomplete", "Che"],
  ["command", "App"],
  ["number-input", "57"],
  ["date-picker", "04"],
  ["color-picker", "#ff000080"],
] as const

for (const [component, text] of fields) {
  test(`${component}: text typed before hydration stays`, async ({
    page,
    open,
  }) => {
    await open(component, { hydrate: "manual" })
    const input = page.locator("input:not([type=hidden])").first()
    await input.fill(text)
    await page.evaluate(() =>
      (window as unknown as { hydrate: () => void }).hydrate()
    )
    await expect(input).toHaveValue(text)
    expect(
      await page.evaluate(
        () =>
          (window as unknown as { __hydrationErrors: string[] })
            .__hydrationErrors
      )
    ).toEqual([])
  })
}
