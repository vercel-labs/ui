import AxeBuilder from "@axe-core/playwright"
import { carouselFixture } from "../fixtures/carousel"
import { expect, test } from "../fixtures"
import { expectShown, indicator, nextButton } from "./carousel.helpers"

async function audit(page: import("@playwright/test").Page) {
  // Page structure rules are about the fixture page, not the component.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

test("no axe violations on the first slide", async ({ page, open }) => {
  await open("carousel")
  await expectShown(page, 0)
  expect(await audit(page)).toEqual([])
})

test("no axe violations on the last slide, with Next at its end", async ({
  page,
  open,
}) => {
  await open("carousel", { "default-page": "5" })
  await expectShown(page, 4)
  expect(await audit(page)).toEqual([])
})

test("no axe violations with three slides to a view", async ({
  page,
  open,
}) => {
  await open("carousel", { "per-view": "3" })
  await expectShown(page, 0, 1, 2)
  await nextButton(page).click()
  await expectShown(page, 1, 2, 3)
  expect(await audit(page)).toEqual([])
})

test("no axe violations in a vertical carousel", async ({ page, open }) => {
  await open("carousel", { orientation: "vertical" })
  await expectShown(page, 0)
  expect(await audit(page)).toEqual([])
})

test("no axe violations while rotating, with the play toggle", async ({
  page,
  open,
}) => {
  await open("carousel", { playing: "", interval: "5000" })
  await expectShown(page, 0)
  expect(await audit(page)).toEqual([])
})

test("no axe violations with focus on an indicator @enhancement", async ({
  page,
  open,
}) => {
  await open("carousel")
  await indicator(page, 1).focus()
  await page.keyboard.press("ArrowRight")
  await expectShown(page, 1)
  expect(await audit(page)).toEqual([])
})

test("the carousel and its slides are named @enhancement", async ({
  page,
  open,
}) => {
  await open("carousel")
  await expect(
    page.getByRole("region", { name: carouselFixture.label })
  ).toBeVisible()
  await expect(page.getByRole("group", { name: "1 of 5" })).toBeVisible()
  await nextButton(page).click()
  await expect(page.getByRole("group", { name: "2 of 5" })).toBeVisible()
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree @enhancement", async ({ page, open }) => {
  await open("carousel")
  await expectShown(page, 0)
  await expect(page.getByRole("region", { name: carouselFixture.label }))
    .toMatchAriaSnapshot(`
    - region "Featured products":
      - group "1 of 5":
        - paragraph: Desk lamp
        - link "View desk lamp":
          - /url: "?product=1"
      - button "Previous slide" [disabled]
      - button "Next slide"
      - tablist "Choose a slide":
        - tab "Slide 1" [selected]: "1"
        - tab "Slide 2": "2"
        - tab "Slide 3": "3"
        - tab "Slide 4": "4"
        - tab "Slide 5": "5"
  `)
})
