import { expect, type Page } from "@playwright/test"
import { countRestyles, readCounts, resetCounts, waitFrames } from "./init"

// What one drag or keyboard run cost: the DOM calls and renders `init.ts`
// counts, the attributes and styles the page wrote, and on Chromium the
// elements restyled.
type DragCounts = Awaited<ReturnType<typeof readCounts>> & {
  writes: number
  restyled?: { recalcs: number; elements: number }
}

// Counts attribute writes, inline styles included, with a MutationObserver.
// Setting an attribute to the value it has is a write too.
async function watchWrites(page: Page) {
  await page.evaluate(() => {
    const watch = {
      writes: 0,
      observer: undefined as MutationObserver | undefined,
    }
    watch.observer = new MutationObserver(
      (records) => (watch.writes += records.length)
    )
    watch.observer.observe(document, { attributes: true, subtree: true })
    Object.assign(window, { __writes: watch })
  })
}

async function readWrites(page: Page) {
  return page.evaluate(() => {
    const watch = (
      window as unknown as {
        __writes: { writes: number; observer: MutationObserver }
      }
    ).__writes
    const writes = watch.writes + watch.observer.takeRecords().length
    watch.observer.disconnect()
    return writes
  })
}

/**
 * Presses at `from`, moves once to start the drag, then counts `moves` more
 * moves of `step` pixels each, one per frame, the way a pointer sends them.
 * Releases once counted. With `trace`, a Chromium trace also counts the
 * elements restyled.
 */
async function countDrag(
  page: Page,
  {
    from,
    step,
    moves = 10,
    trace,
  }: {
    from: { x: number; y: number }
    step: { x: number; y: number }
    moves?: number
    trace: boolean
  }
) {
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await waitFrames(page, 2)
  // The first move starts the drag, so it isn't counted.
  let at = { x: from.x + step.x, y: from.y + step.y }
  await page.mouse.move(at.x, at.y)
  await waitFrames(page, 2)
  await resetCounts(page)
  await watchWrites(page)
  const run = async () => {
    for (let move = 0; move < moves; move++) {
      at = { x: at.x + step.x, y: at.y + step.y }
      await page.mouse.move(at.x, at.y)
      await waitFrames(page, 1)
    }
  }
  const restyled = trace
    ? await countRestyles(page, run)
    : (await run(), undefined)
  const writes = await readWrites(page)
  const counts: DragCounts = { ...(await readCounts(page)), writes, restyled }
  await page.mouse.up()
  return counts
}

/**
 * Counts `presses` presses of `key` on what has focus, and the frame after
 * them. `afterEach` runs after each press, with its number from 1, to check
 * what the press did before the next one.
 */
async function countKeys(
  page: Page,
  key: string,
  {
    presses = 10,
    afterEach,
  }: { presses?: number; afterEach?: (press: number) => Promise<unknown> } = {}
) {
  await resetCounts(page)
  await watchWrites(page)
  for (let press = 1; press <= presses; press++) {
    await page.keyboard.press(key)
    await afterEach?.(press)
  }
  await waitFrames(page, 1)
  const writes = await readWrites(page)
  return { ...(await readCounts(page)), writes }
}

/**
 * Checks a run against a drag budget. Every number is a bound for the whole
 * run, the same at every size, except `restyledPerMove`. `see` links to the
 * budget's catalog entry.
 */
function expectWithin(
  result: DragCounts,
  budget: {
    renders: Record<string, number>
    counts: Record<string, number>
    writes: number
    restyledPerMove?: number
  },
  { moves = 10, see }: { moves?: number; see: string }
) {
  for (const [kind, most] of Object.entries(budget.renders)) {
    expect
      .soft(result.renders[kind] ?? 0, `${kind} renders. ${see}`)
      .toBeLessThanOrEqual(most)
  }
  for (const [name, most] of Object.entries(budget.counts)) {
    expect
      .soft(result.counts[name] ?? 0, `${name} calls. ${see}`)
      .toBeLessThanOrEqual(most)
  }
  expect
    .soft(result.writes, `Attribute and style writes. ${see}`)
    .toBeLessThanOrEqual(budget.writes)
  if (result.restyled && budget.restyledPerMove !== undefined) {
    expect
      .soft(
        result.restyled.elements / moves,
        `Elements restyled per move. ${see}`
      )
      .toBeLessThanOrEqual(budget.restyledPerMove)
  }
}

export { countDrag, countKeys, expectWithin }
