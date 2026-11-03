import * as React from "react"
import { createArea, createChange, definePrimitive, type AreaValue } from "@ui-sdk/core"
import { createParts } from "@ui-sdk/react/primitive"

type ColorState = { color: AreaValue; locked: boolean }

type ColorOptions = {
  locked?: boolean
  onColorChange?: (color: AreaValue) => void
  onColorCommit?: (color: AreaValue) => void
}

const color = definePrimitive({
  name: "color",
  options: { locked: "boolean", onColorChange: "callback", onColorCommit: "callback" },
  state: (options: ColorOptions): ColorState => ({ color: { x: 60, y: 80 }, locked: !!options.locked }),
  sync: (options) => ({ locked: !!options.locked }),
  api: (context) => {
    const change = createChange(context)
    const area = createArea<ColorState>(context, {
      value: (state) => state.color,
      set: (value, details) => change("color", value, details),
      x: () => ({ min: 0, max: 100, step: 1, label: "Saturation" }),
      y: () => ({ min: 0, max: 100, step: 1, label: "Brightness" }),
      valueText: ({ x, y }) => `${x}% saturation, ${y}% brightness`,
      onCommit: (value) => context.options().onColorCommit?.(value),
      disabled: () => context.store.get().locked,
    })
    return { area }
  },
  slots: (slot) => ({
    root: slot<{}, { swatch: string }>({
      state: (state, { api }) => {
        const { x, y } = api.area.fractions(state)
        const lightness = y * (1 - x / 2)
        const saturation =
          lightness === 0 || lightness === 1 ? 0 : (y - lightness) / Math.min(lightness, 1 - lightness)
        return { swatch: `hsl(210 ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%)` }
      },
    }),
    square: slot({
      attrs: () => ({ style: "position:relative;touch-action:none;user-select:none" }),
      on: { pointerdown: (event, { el, api }) => api.area.pointerdown(event, el!) },
    }),
    thumb: slot({
      attrs: (state, { api }) => ({ ...api.area.thumbAttrs(state), style: api.area.thumbStyle(state) }),
      on: { keydown: (event, { api }) => api.area.keydown(event) },
    }),
    reset: slot({
      attrs: () => ({ type: "button" }),
      press: ({ api }) => api.area.set({ x: 60, y: 80 }),
    }),
  }),
})

const parts = createParts(color, { root: "div", square: "div", thumb: "div", reset: "button" })

const ColorPicker = parts.Root

const ColorSquare = parts.Square

const ColorThumb = parts.Thumb

const ColorReset = parts.Reset

function Example() {
  const [locked, setLocked] = React.useState(false)
  const [saved, setSaved] = React.useState({ x: 60, y: 80 })
  return (
    <ColorPicker locked={locked} onColorCommit={setSaved}>
      {({ swatch }) => (
        <>
          <ColorSquare>
            <ColorThumb aria-label="Color" />
          </ColorSquare>
          <div data-slot="row">
            <span data-slot="swatch" style={{ background: swatch }} />
            <span data-slot="output">
              Saved {saved.x}% saturation, {saved.y}% brightness
            </span>
          </div>
          <div data-slot="row">
            <ColorReset data-size="sm">Reset</ColorReset>
            <label data-slot="label">
              <input type="checkbox" checked={locked} onChange={(event) => setLocked(event.target.checked)} />
              Lock
            </label>
          </div>
        </>
      )}
    </ColorPicker>
  )
}

export {
  ColorPicker,
  ColorReset,
  ColorSquare,
  color,
  type ColorOptions,
  type ColorState,
  ColorThumb,
  Example,
}
