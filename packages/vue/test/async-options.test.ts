// @vitest-environment jsdom
import { expect, test } from "vitest"
import { createApp, defineComponent, h, nextTick } from "vue"
import { useAsyncOptions } from "../src/async-options"

test("an immediate load starts once the component mounts, and cancels on unmount", async () => {
  const signals: AbortSignal[] = []
  const load = (_query: string, { signal }: { signal: AbortSignal }) => {
    signals.push(signal)
    return new Promise<string[]>(() => {})
  }
  const Options = defineComponent(() => {
    const { state } = useAsyncOptions(load, { immediate: true })
    return () => h("p", state.value.status)
  })
  const root = document.createElement("div")
  const app = createApp(Options)
  app.mount(root)
  await nextTick()
  expect(root.textContent).toBe("loading")
  expect(signals).toHaveLength(1)
  app.unmount()
  expect(signals.map((signal) => signal.aborted)).toEqual([true])
})
