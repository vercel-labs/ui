// @vitest-environment jsdom
// Vue 3.6 sets up a Vapor component with an instance that only `inject` sees,
// like `app.runWithContext` does here.
import { tabs } from "@ui-sdk/core/tabs"
import { createApp } from "vue"
import { expect, test } from "vitest"
import { usePart, usePrimitive } from "../src/primitive"

test("a root set up as a Vapor component says to install vaporInteropPlugin", () => {
  expect(() =>
    createApp({}).runWithContext(() => usePrimitive(tabs, () => ({})))
  ).toThrow(
    "A ui-sdk root is set up as a Vapor component, but ui-sdk parts are VDOM components. In a Vapor app, install vaporInteropPlugin."
  )
})

test("a part set up as a Vapor component says to install vaporInteropPlugin", () => {
  expect(() =>
    createApp({}).runWithContext(() => usePart(tabs, "tab"))
  ).toThrow(
    "The tab part is set up as a Vapor component, but ui-sdk parts are VDOM components. In a Vapor app, install vaporInteropPlugin. Define your own parts with defineComponent."
  )
})

test("a part outside any setup still says to call usePart in its setup", () => {
  expect(() => usePart(tabs, "tab")).toThrow(
    "The tab part must call usePart in its setup."
  )
})
