<script lang="ts">
  import { definePrimitive } from "@ui-sdk/core"
  import { useHandlePart, usePrimitive } from "../../src/use-primitive.svelte"

  const hiddenControl = definePrimitive({
    name: "hidden-control",
    state: () => ({ open: false, flag: "a" }),
    api: ({ store }) => ({
      setFlag: (flag: string) => store.set({ flag }),
    }),
    slots: (slot) => ({
      panel: slot({
        present: (state) => state.open,
        attrs: (state) => ({ "data-flag": state.flag }),
      }),
    }),
  })

  const id = $props.id()
  const control = usePrimitive(hiddenControl, () => ({ id }))
  const panel = useHandlePart(control, "panel")
  export const api = control.api
</script>

<output>{panel.attrs["data-flag"]}</output>
