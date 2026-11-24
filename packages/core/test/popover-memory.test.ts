// @vitest-environment jsdom
import { setFlagsFromString } from "node:v8"
import { runInNewContext } from "node:vm"
import { expect, test } from "vitest"
import { popover } from "../src/components/popover/popover"
import { bind } from "../src/foundation/kernel/part"

setFlagsFromString("--expose-gc")
const gc = runInNewContext("gc") as () => void

test("a closed popover lets go of the content it unmounted", async () => {
  const instance = popover({ id: "profile" })
  const trigger = document.createElement("button")
  trigger.textContent = "Profile"
  document.body.append(trigger)
  const unbindTrigger = bind(instance.part("trigger"), trigger)
  const mountContent = () => {
    const content = Object.assign(document.createElement("div"), {
      getAnimations: () => [],
    })
    content.innerHTML = "<input aria-label='Name'>"
    trigger.after(content)
    return { content, unbind: bind(instance.part("content"), content) }
  }
  let shown: ReturnType<typeof mountContent> | undefined = mountContent()
  instance.api.setOpen(true)
  await Promise.resolve()
  instance.api.setOpen(false)
  const content = new WeakRef(shown.content)
  shown.unbind()
  shown.content.remove()
  shown = undefined
  await new Promise((resolve) => setTimeout(resolve))
  gc()
  expect(content.deref()).toBeUndefined()
  unbindTrigger()
  trigger.remove()
  instance.destroy()
})
