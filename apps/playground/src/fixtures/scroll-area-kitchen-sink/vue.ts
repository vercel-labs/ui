import {
  createScrollAreaController,
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaScrollToEnd,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/vue"
import {
  createApp,
  defineComponent,
  h,
  onMounted,
  ref,
  type PropType,
} from "vue"
import * as classes from "./classes"
import {
  fadeBottom,
  fadeBottomStyle,
  fadeTop,
  fadeTopStyle,
  kitchenSink,
  rootClass,
  variantControls,
  viewportClass,
  type Env,
} from "./shell"
import { fillContent, type Variant } from "./variants"

const scrollbar = (orientation: "vertical" | "horizontal") =>
  h(ScrollAreaScrollbar, { class: classes.scrollbar, orientation }, () =>
    h(ScrollAreaThumb, { class: classes.thumb })
  )

const VariantScrollArea = defineComponent({
  props: {
    variant: { type: Object as PropType<Variant>, required: true as const },
    env: { type: Object as PropType<Env>, required: true as const },
  },
  setup({ variant, env }) {
    const controller = createScrollAreaController()
    // A ref on a component holds the component; its element is `$el`.
    const content = ref<{ $el: HTMLElement }>()
    onMounted(() => {
      const el = content.value!.$el
      fillContent(el, variant)
      variantControls(variant, el, controller, env)
    })
    const { scrollbars } = variant
    return () =>
      h(
        ScrollArea,
        { class: rootClass(variant), controller, ...variant.options },
        () => [
          h(ScrollAreaViewport, { class: viewportClass(variant) }, () =>
            h(ScrollAreaContent, { ref: content, class: classes.content })
          ),
          variant.fade && h("div", { class: fadeTop, style: fadeTopStyle }),
          variant.fade &&
            h("div", { class: fadeBottom, style: fadeBottomStyle }),
          (scrollbars === "vertical" || scrollbars === "both") &&
            scrollbar("vertical"),
          (scrollbars === "horizontal" || scrollbars === "both") &&
            scrollbar("horizontal"),
          scrollbars === "both" &&
            h(ScrollAreaCorner, { class: classes.corner }),
          variant.jump &&
            h(
              ScrollAreaScrollToEnd,
              { class: classes.jump },
              () => "Jump to latest"
            ),
        ]
      )
  },
})

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) =>
    createApp(VariantScrollArea, { variant, env }).mount(slot)
  )
}

export { mount }
