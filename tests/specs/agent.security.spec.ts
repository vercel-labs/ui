import type { Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"
import { agentReachFixture } from "../fixtures/agent-reach"

// An agent on the page reaches what a person can and nothing else. Only a
// browser lays the page out, so only here is content hidden by CSS, a closed
// <details> or the page behind a modal dialog really out of a person's reach.
const { shown, hidden, inert, dialog } = agentReachFixture

type Listed = { label?: string; disabled?: boolean; actions: string[] }
type Bridge = {
  __agent: {
    snapshot: () => Listed[]
    act: (call: {
      steps: { ref: string; action: string; args: unknown[] }[]
    }) => Promise<{ ok: boolean }>
  }
}

// What the agent lists under a label, or null when it lists nothing.
const listed = (page: Page, label: string) =>
  page.evaluate((label) => {
    const entry = (window as unknown as Bridge).__agent
      .snapshot()
      .find((entry) => entry.label === label)
    return entry
      ? { disabled: entry.disabled ?? false, actions: entry.actions }
      : null
  }, label)

// Whether a step from the agent went through.
const step = (page: Page, ref: string, action: string, ...args: unknown[]) =>
  page.evaluate(
    async (step) =>
      (await (window as unknown as Bridge).__agent.act({ steps: [step] })).ok,
    { ref, action, args }
  )

async function refusesBoth(page: Page, name: string) {
  expect(await step(page, `${name} field`, "setValue", "Ada")).toBe(false)
  expect(await step(page, `${name} button`, "press")).toBe(false)
  expect(await lastAction(page)).toBe("")
}

test("an agent fills a field and presses a button a person can reach", async ({
  page,
  open,
}) => {
  await open("agent-reach", { agent: "" })
  expect(await listed(page, `${shown} field`)).toMatchObject({
    disabled: false,
  })
  expect(await step(page, `${shown} field`, "setValue", "Ada")).toBe(true)
  await expect(
    page.getByRole("textbox", { name: `${shown} field` })
  ).toHaveValue("Ada")
  expect(await step(page, `${shown} button`, "press")).toBe(true)
  expect(await lastAction(page)).toBe(`${shown} pressed`)
})

for (const { name, how } of hidden) {
  test(`an agent finds nothing inside ${how}, and its steps change nothing`, async ({
    page,
    open,
  }) => {
    await open("agent-reach", { agent: "" })
    expect(await listed(page, `${name} field`)).toBeNull()
    expect(await listed(page, `${name} button`)).toBeNull()
    await refusesBoth(page, name)
  })
}

test("an agent sees a field and a button in an inert region, and neither takes a step", async ({
  page,
  open,
}) => {
  await open("agent-reach", { agent: "" })
  const off = { disabled: true, actions: [] }
  expect(await listed(page, `${inert} field`)).toEqual(off)
  expect(await listed(page, `${inert} button`)).toEqual(off)
  await refusesBoth(page, inert)
})

test("the page behind an open modal dialog takes no step from an agent, and the dialog does", async ({
  page,
  open,
}) => {
  await open("agent-reach", { agent: "" })
  await page.getByRole("button", { name: dialog.trigger }).click()
  await expect(page.getByRole("dialog", { name: dialog.title })).toBeVisible()
  expect(await listed(page, `${shown} field`)).toEqual({
    disabled: true,
    actions: [],
  })
  await refusesBoth(page, shown)
  expect(await step(page, `${dialog.name} field`, "setValue", "Ada")).toBe(true)
  expect(await lastAction(page)).toBe(`${dialog.name} set`)
})
