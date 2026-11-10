import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "../fixtures"
import { chronology, eventNamed } from "./chronology.helpers"

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
  await open("chronology")
  expect(await audit(page)).toEqual([])
})

test("no axe violations with focus on an event", async ({ page, open }) => {
  await open("chronology")
  await eventNamed(page, "Packed").focus()
  expect(await audit(page)).toEqual([])
})

test("no axe violations in a horizontal chronology", async ({ page, open }) => {
  await open("chronology", { orientation: "horizontal" })
  expect(await audit(page)).toEqual([])
})

test("no axe violations in a busy feed", async ({ page, open }) => {
  await open("chronology", { feed: "", busy: "" })
  expect(await audit(page)).toEqual([])
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("chronology")
  await expect(chronology(page)).toMatchAriaSnapshot(`
    - list "Order history":
      - listitem "Order placed":
        - text: Order placed
        - time: Nov 1
        - text: We received your order.
      - listitem "Packed":
        - text: Packed
        - time: Nov 2
        - text: Your items left the shelf.
      - listitem "Shipped":
        - text: Shipped
        - time: Nov 3
        - text: On its way with the carrier.
        - link "Track package"
      - listitem "Delivered":
        - text: Delivered
        - time: Nov 5
        - text: Expected by Thursday.
  `)
})

test("accessibility tree of a feed", async ({ page, open }) => {
  await open("chronology", { feed: "" })
  await expect(chronology(page, "feed")).toMatchAriaSnapshot(`
    - feed "Order history":
      - article "Order placed"
      - article "Packed"
      - article "Shipped":
        - link "Track package"
      - article "Delivered"
  `)
})
