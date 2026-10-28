import { render } from "@solidjs/web"
import { flush } from "solid-js"
import { expect, test } from "vitest"
import { useAsyncOptions } from "../src/async-options"

test("an immediate load starts once the component mounts, and cancels on unmount", () => {
  const signals: AbortSignal[] = []
  const load = (_query: string, { signal }: { signal: AbortSignal }) => {
    signals.push(signal)
    return new Promise<string[]>(() => {})
  }
  function Options() {
    const options = useAsyncOptions(load, { immediate: true })
    return <p>{options.status}</p>
  }
  const root = document.createElement("div")
  document.body.append(root)
  const dispose = render(() => <Options />, root)
  flush()
  expect(root.textContent).toBe("loading")
  expect(signals).toHaveLength(1)
  dispose()
  root.remove()
  expect(signals.map((signal) => signal.aborted)).toEqual([true])
})
