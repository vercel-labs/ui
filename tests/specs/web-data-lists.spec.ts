import { expect, test } from "../fixtures"

// Web components with data take `items` as a property, which a script sets
// after the markup, and render their parts as copies of the ones in their
// <template>.

test.beforeEach(({ framework }) => {
  test.skip(
    !framework.startsWith("web"),
    "Only web components read items after their attributes."
  )
})

const plans = [
  { value: { id: "free" }, label: "Free" },
  { value: { id: "pro" }, label: "Pro" },
  { value: { id: "team" }, label: "Team" },
]

for (const [fixture, tag] of [
  ["listbox", "ui-listbox"],
  ["select", "ui-select"],
  ["combobox", "ui-combobox"],
] as const) {
  test(`a ${tag} default-value set before items becomes the item's value`, async ({
    page,
    open,
  }) => {
    await open(fixture)
    const result = await page.evaluate(
      ({ tag, plans }) =>
        new Promise<{ value: unknown; changes: number }>((resolve) => {
          const el = document.createElement(tag) as HTMLElement &
            Record<string, any>
          el.setAttribute("default-value", "pro")
          el.setAttribute("aria-label", "Plan")
          let changes = 0
          el.addEventListener("valuechange", () => changes++)
          document.body.append(el)
          el.itemToValue = (plan: { id: string }) => plan.id
          el.isItemEqualToValue = (a: { id: string }, b: { id: string }) =>
            a?.id === b?.id
          el.items = plans
          // Parts upgrade and render in a microtask.
          setTimeout(() => resolve({ value: el.api.getValue(), changes }))
        }),
      { tag, plans }
    )
    expect(result).toEqual({ value: { id: "pro" }, changes: 0 })
  })

  test(`a form reset brings a ${tag} back to the item its default-value names`, async ({
    page,
    open,
  }) => {
    await open(fixture)
    const value = await page.evaluate(
      ({ tag, plans }) =>
        new Promise<unknown>((resolve) => {
          const form = document.createElement("form")
          const el = document.createElement(tag) as HTMLElement &
            Record<string, any>
          el.setAttribute("default-value", "pro")
          el.setAttribute("aria-label", "Plan")
          el.setAttribute("name", "plan")
          form.append(el)
          document.body.append(form)
          el.itemToValue = (plan: { id: string }) => plan.id
          el.isItemEqualToValue = (a: { id: string }, b: { id: string }) =>
            a?.id === b?.id
          el.items = plans
          setTimeout(() => {
            el.api.setValue({ id: "team" })
            form.reset()
            setTimeout(() => resolve(el.api.getValue()))
          })
        }),
      { tag, plans }
    )
    expect(value).toEqual({ id: "pro" })
  })
}

test("a data command's items copy the item in its template", async ({
  page,
  open,
}) => {
  await open("command")
  await page.evaluate(() => {
    const el = document.createElement("ui-command") as HTMLElement &
      Record<string, any>
    el.id = "templated"
    el.innerHTML = `
      <ui-command-input><input aria-label="Fruit search" /></ui-command-input>
      <template><ui-command-item class="fruit"></ui-command-item></template>`
    document.body.append(el)
    el.items = ["Apple", "Banana"]
  })
  await expect(page.locator("#templated .fruit")).toHaveText([
    "Apple",
    "Banana",
  ])
})

test("a data autocomplete's suggestions copy the item in its template", async ({
  page,
  open,
}) => {
  await open("autocomplete")
  await page.evaluate(() => {
    const el = document.createElement("ui-autocomplete") as HTMLElement &
      Record<string, any>
    el.id = "templated"
    el.innerHTML = `
      <ui-autocomplete-input><input aria-label="Favorite fruit" /></ui-autocomplete-input>
      <template>
        <ui-autocomplete-content class="fruits"></ui-autocomplete-content>
        <ui-autocomplete-item class="fruit"></ui-autocomplete-item>
      </template>`
    document.body.append(el)
    el.items = ["Apple", "Banana"]
  })
  await page.getByRole("combobox", { name: "Favorite fruit" }).focus()
  await page.keyboard.press("ArrowDown")
  await expect(page.locator("#templated .fruits .fruit")).toHaveText([
    "Apple",
    "Banana",
  ])
})
