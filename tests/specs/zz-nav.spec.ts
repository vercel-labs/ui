import type { Page } from "@playwright/test"
import { expect, slowTransitions, test } from "../fixtures"

const trigger = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true })
const link = (page: Page, name: string) =>
  page.getByRole("link", { name, exact: true })

async function state(page: Page) {
  return page.evaluate(() => {
    const vp = document.querySelector<HTMLElement>(".root-vp")!
    const a = document.activeElement as HTMLElement | null
    return {
      calls: JSON.stringify((window as any).__calls),
      active: a ? a.tagName + ":" + (a.textContent ?? "").slice(0, 20) : "null",
      inert: vp.inert,
      hidden: vp.hidden,
      ending: vp.hasAttribute("data-ending-style"),
    }
  })
}

async function tabOut(page: Page) {
  await trigger(page, "Resources").focus()
  await page.keyboard.press("Enter")
  await expect(link(page, "Blog")).toBeVisible()
  await link(page, "Pricing").focus()
  await page.keyboard.press("Tab")
}

async function reopenAndEnter(page: Page) {
  await trigger(page, "Products").focus()
  await page.keyboard.press("Enter")
  await expect(link(page, "Analytics")).toBeVisible()
  await page.keyboard.press("Tab")
  return page.evaluate(() => document.activeElement?.textContent)
}

for (const query of [
  {},
  { strict: "" },
  { "keep-mounted": "", strict: "" },
  { "hidden-until-found": "", strict: "" },
  { nested: "", strict: "" },
  { controlled: "", strict: "" },
]) {
  test(`basic ${JSON.stringify(query)}`, async ({ page, open }) => {
    await open("zz-nav", query)
    await tabOut(page)
    const s1 = await state(page)
    await page.waitForTimeout(100)
    const s2 = await state(page)
    console.log(JSON.stringify(query), "after", s1, "later", s2)
    const into = await reopenAndEnter(page)
    console.log(JSON.stringify(query), "reopen tab ->", into, await state(page))
    expect(into).toBe("Analytics")
  })
}

test("animate", async ({ page, open }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await open("zz-nav", { animate: "", strict: "" })
  await tabOut(page)
  const s1 = await state(page)
  await page.waitForTimeout(30)
  const s2 = await state(page)
  await page.waitForTimeout(600)
  const s3 = await state(page)
  console.log("animate", s1, s2, s3)
  const into = await reopenAndEnter(page)
  console.log("animate reopen ->", into, await state(page))
  expect(s3.inert).toBe(false)
  expect(into).toBe("Analytics")
})

test("animate slow", async ({ page, open }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await open("zz-nav", { animate: "", strict: "" })
  await page.addStyleTag({
    content: ".nav-viewport { transition-duration: 1500ms !important }",
  })
  await tabOut(page)
  const s1 = await state(page)
  await page.waitForTimeout(100)
  const s2 = await state(page)
  await page.waitForTimeout(2000)
  const s3 = await state(page)
  console.log("slow", s1, s2, s3)
  expect(s3.inert).toBe(false)
  const into = await reopenAndEnter(page)
  expect(into).toBe("Analytics")
})

test("refuse", async ({ page, open }) => {
  await open("zz-nav", { refuse: "", strict: "" })
  await tabOut(page)
  const s1 = await state(page)
  await page.waitForTimeout(100)
  const s2 = await state(page)
  console.log("refuse", s1, s2)
  await page.keyboard.press("Tab")
  console.log("refuse second tab", await state(page))
  await page.keyboard.press("Tab")
  console.log("refuse third tab", await state(page))
})

test("closed menu tab from Pricing", async ({ page, open }) => {
  await open("zz-nav", { strict: "" })
  await link(page, "Pricing").focus()
  await page.keyboard.press("Tab")
  console.log("closed", await state(page))
})

test("synthetic double keydown in one task while refused and prevented", async ({
  page,
  open,
}) => {
  await open("zz-nav", { refuse: "", strict: "" })
  await trigger(page, "Resources").focus()
  await page.keyboard.press("Enter")
  await expect(link(page, "Blog")).toBeVisible()
  await link(page, "Pricing").evaluate((el) => {
    ;(el as HTMLElement).focus()
    for (let i = 0; i < 2; i++) {
      el.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true })
      )
    }
  })
  await page.waitForTimeout(100)
  console.log("double", await state(page))
})
