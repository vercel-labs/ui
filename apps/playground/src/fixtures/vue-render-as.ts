import { h, type Component, type FunctionalComponent } from "vue"

type RenderScope = {
  props: Record<string, unknown>
  children: FunctionalComponent
}

// A part's slots for render functions: its content, and with a tag, a
// `render` slot that renders the part as that tag or component around it.
function renderAs(
  tag: string | Component | undefined,
  content?: () => unknown
) {
  const slots: Record<string, unknown> = content ? { default: content } : {}
  if (!tag) {
    return slots
  }
  slots.render = ({ props, children }: RenderScope) => {
    if (typeof tag !== "string") {
      return h(tag, props, content && { default: () => h(children) })
    }
    return h(tag, props, content && h(children))
  }
  return slots
}

export { renderAs }
