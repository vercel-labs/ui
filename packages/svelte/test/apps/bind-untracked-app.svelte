<script lang="ts">
  import { definePrimitive } from "@ui-sdk/core"
  import { createParts } from "../../src/primitive"

  let { log }: { log: { binds: number; unbinds: number } } = $props()

  const probe = definePrimitive({
    name: "probe",
    options: { look: "value" },
    state: (_options: { look?: () => unknown }) => ({}),
    api: (context) => ({ look: () => context.options().look?.() }),
    slots: (slot) => ({
      root: slot({}),
      watcher: slot({
        bind: (el, { api }) => {
          log.binds++
          el.dataset.looked = String(api.look())
          return () => {
            log.unbinds++
          }
        },
      }),
    }),
    agent: { actions: [] },
  })

  const parts = createParts(probe, { root: "div", watcher: "span" })
  let count = $state(0)
  const look = () => count

  export function change() {
    count++
  }
</script>

<parts.Root {look}><parts.Watcher /></parts.Root>
