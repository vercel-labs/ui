import {
  createScrollAreaController,
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaScrollToEnd,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/react/scroll-area"
import * as React from "react"
import { createRoot } from "react-dom/client"
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

const style = (css: string) =>
  Object.fromEntries(
    css.split(";").map((declaration) => declaration.split(":"))
  ) as React.CSSProperties

function Scrollbar({
  orientation,
}: {
  orientation: "vertical" | "horizontal"
}) {
  return (
    <ScrollAreaScrollbar
      className={classes.scrollbar}
      orientation={orientation}
    >
      <ScrollAreaThumb className={classes.thumb} />
    </ScrollAreaScrollbar>
  )
}

function VariantScrollArea({ variant, env }: { variant: Variant; env: Env }) {
  const [controller] = React.useState(createScrollAreaController)
  const content = React.useRef<HTMLDivElement>(null)
  React.useLayoutEffect(() => {
    const el = content.current!
    // The content is plain DOM, filled once, so every framework shows the same.
    if (!el.childElementCount) {
      fillContent(el, variant)
    }
    variantControls(variant, el, controller, env)
  }, [variant, env, controller])
  const { scrollbars } = variant
  return (
    <ScrollArea
      className={rootClass(variant)}
      controller={controller}
      {...variant.options}
    >
      <ScrollAreaViewport className={viewportClass(variant)}>
        <ScrollAreaContent ref={content} className={classes.content} />
      </ScrollAreaViewport>
      {variant.fade && <div className={fadeTop} style={style(fadeTopStyle)} />}
      {variant.fade && (
        <div className={fadeBottom} style={style(fadeBottomStyle)} />
      )}
      {(scrollbars === "vertical" || scrollbars === "both") && (
        <Scrollbar orientation="vertical" />
      )}
      {(scrollbars === "horizontal" || scrollbars === "both") && (
        <Scrollbar orientation="horizontal" />
      )}
      {scrollbars === "both" && <ScrollAreaCorner className={classes.corner} />}
      {variant.jump && (
        <ScrollAreaScrollToEnd className={classes.jump}>
          Jump to latest
        </ScrollAreaScrollToEnd>
      )}
    </ScrollArea>
  )
}

function mount(root: HTMLElement) {
  kitchenSink(root, "react", (slot, variant, env) =>
    createRoot(slot).render(
      <React.StrictMode>
        <VariantScrollArea variant={variant} env={env} />
      </React.StrictMode>
    )
  )
}

export { mount }
