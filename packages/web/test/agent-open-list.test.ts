// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { createAgent } from "../src/agent"
import { defineComboboxElements } from "../src/combobox"
import { defineSelectElements } from "../src/select"

const wait = (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  defineSelectElements()
  defineComboboxElements()
})

test("an open select or combobox doesn't list its own trigger as a button", async () => {
  const agent = createAgent()
  document.body.innerHTML = `
    <ui-select default-value="banana">
      <ui-select-label>Fruit</ui-select-label>
      <ui-select-trigger><button><ui-select-value></ui-select-value></button></ui-select-trigger>
      <ui-select-content>
        <ui-select-item value="apple">Apple</ui-select-item>
        <ui-select-item value="banana">Banana</ui-select-item>
      </ui-select-content>
    </ui-select>
    <ui-combobox default-value="jp">
      <ui-combobox-input><input aria-label="Country" /></ui-combobox-input>
      <ui-combobox-trigger><button aria-label="Show countries">▾</button></ui-combobox-trigger>
      <ui-combobox-content>
        <ui-combobox-list><ui-combobox-item value="jp">Japan</ui-combobox-item></ui-combobox-list>
      </ui-combobox-content>
    </ui-combobox>`
  await wait()
  const closed = agent.snapshot().map(({ actions }) => actions)
  for (const el of document.querySelectorAll("ui-select, ui-combobox")) {
    ;(el as HTMLElement & { open: boolean }).open = true
  }
  await wait(50)
  const open = agent.snapshot()
  expect(open.map(({ actions }) => actions)).toEqual(closed)
  for (const entry of open) {
    expect(entry).toMatchObject({ open: true })
    expect(entry).not.toHaveProperty("buttons")
  }
})

test("a closed select's items are read without opening it", async () => {
  const agent = createAgent()
  document.body.innerHTML = `
    <ui-select default-value="free">
      <ui-select-label>Plan</ui-select-label>
      <ui-select-trigger><button><ui-select-value></ui-select-value></button></ui-select-trigger>
      <ui-select-content>
        <ui-select-item value="free">Free</ui-select-item>
        <ui-select-item value="pro">Pro</ui-select-item>
      </ui-select-content>
    </ui-select>`
  await wait()
  const select = document.querySelector("ui-select")!
  const opens: boolean[] = []
  select.addEventListener("openchange", (event) =>
    opens.push(event.detail.value)
  )
  const [found] = (await agent.query({ within: "Plan" })) as {
    items: { value: string }[]
  }[]
  expect(found.items.map((item) => item.value)).toEqual(["free", "pro"])
  const outcome = await agent.act({
    steps: [{ ref: "Plan", action: "setValue", args: ["Pro"] }],
  })
  expect(outcome.ok).toBe(true)
  expect(opens).toEqual([])
})
