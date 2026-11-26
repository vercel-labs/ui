// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { createAgent } from "../src/agent"
import { defineRatingElements } from "../src/rating"

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  defineRatingElements()
})

test("an agent sets a rating by its score, with no stars listed as choices", async () => {
  const agent = createAgent()
  document.body.innerHTML = `
    <ui-rating aria-label="Rating" default-value="3">
      <template>
        <ui-rating-item><svg aria-hidden="true" viewBox="0 0 24 24"></svg></ui-rating-item>
      </template>
    </ui-rating>`
  await wait()
  const [rating] = agent.snapshot()
  expect(rating).toMatchObject({
    component: "rating",
    label: "Rating",
    value: "3",
  })
  expect(rating.items).toBeUndefined()
  expect(document.querySelector("ui-rating-item")!.hasAttribute("id")).toBe(
    false
  )
  const result = await agent.act({
    steps: [{ ref: rating.ref, action: "setValue", args: [4] }],
  })
  expect(result.ok).toBe(true)
  expect(agent.snapshot()[0].value).toBe("4")
})
