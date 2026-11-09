import { menu } from "@ui-sdk/core/menu"
import { usePart, usePrimitive } from "@ui-sdk/vue/primitive"
import { countSubscriptions, perfItems, perfSize } from "tests/fixtures/perf.ts"
import { createApp, defineComponent, h, ref } from "vue"

// Custom parts built on `usePart`, which the specs render again and
// again to count how often each part subscribes to its instance.
const items = perfItems(perfSize())

const Item = defineComponent({
  props: {
    value: { type: String, required: true },
    label: { type: String, required: true },
    // Changes on every round, so the item renders again.
    round: { type: Number, required: true },
  },
  setup(props) {
    return usePart(
      menu,
      "item",
      () => ({ value: props.value }),
      () => ({ "data-round": props.round }),
      {
        tag: "div",
        children: (state) => [state.highlighted ? "→ " : "", props.label],
      }
    )
  },
})

const Fixture = defineComponent({
  setup() {
    const handle = usePrimitive(menu, () => ({}))
    countSubscriptions(handle.instance)
    const renders = ref(0)
    return () =>
      h("div", { class: "fixture" }, [
        h("button", "Before"),
        h("button", { onClick: () => renders.value++ }, "Render again"),
        h("output", { "aria-label": "Renders" }, String(renders.value)),
        h(
          "div",
          { role: "menu", "aria-label": "Items" },
          items.map((item) =>
            h(Item, {
              key: item.value,
              value: item.value,
              label: item.label,
              round: renders.value,
            })
          )
        ),
        h("button", "After"),
      ])
  },
})

function mount(root: HTMLElement) {
  createApp(Fixture).mount(root)
}

export { mount }
