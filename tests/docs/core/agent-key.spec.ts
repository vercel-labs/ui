import { expect } from "@playwright/test"
import { test } from "../docs-test"
import { openExamples } from "./behaviors/helpers"

test("the rating's agent key lets an agent read it and rate", async ({
  page,
}) => {
  const { errors } = await openExamples(
    page,
    "/docs/agents/connect-an-agent/your-components"
  )
  const example = page.locator("[data-example]").first()
  await example.getByRole("button", { name: "Read the page" }).click()
  const output = example.getByRole("status")
  await expect(output).toContainText('"label": "Your rating"')
  await expect(output).toContainText('"rate"')
  await example.getByRole("button", { name: "Ask for 4 stars" }).click()
  await expect(output).toContainText('"ok": true')
  const stars = example.getByRole("group", { name: "Your rating" })
  await expect(stars.getByRole("button", { name: "4 stars" })).toHaveAttribute(
    "data-filled",
    ""
  )
  await expect(
    stars.getByRole("button", { name: "5 stars" })
  ).not.toHaveAttribute("data-filled")
  expect(errors).toEqual([])
})
