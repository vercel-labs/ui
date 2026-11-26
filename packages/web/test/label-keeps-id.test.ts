// @vitest-environment jsdom
import { label } from "@ui-sdk/core/label"
import { beforeAll, expect, test } from "vitest"
import { createParts, wrappedChild } from "../src/define-element"

const wait = () => new Promise((resolve) => setTimeout(resolve, 50))

beforeAll(() => {
  createParts(label, {
    root: { tag: "x-keep-label", target: wrappedChild("label") },
  })
})

test("a label whose target holds its id keeps that id when it's put back on the page", async () => {
  document.body.innerHTML = `<div id="list"><div id="row"><x-keep-label><label>Archived</label></x-keep-label></div></div>`
  await wait()
  const native = document.querySelector("label")!
  const id = native.id
  expect(id).not.toBe("")
  const row = document.getElementById("row")!
  row.remove()
  await wait()
  document.getElementById("list")!.append(row)
  await wait()
  expect(native.id).toBe(id)
})
