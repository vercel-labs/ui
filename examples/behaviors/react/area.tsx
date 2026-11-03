import * as React from "react"
import { createArea, createChange, definePrimitive, type AreaReason, type ChangeDetails } from "@ui-sdk/core"
import { createParts, usePart, usePrimitive, type PartProps } from "@ui-sdk/react/primitive"

type Mix = { warmth: number; energy: number }

type MixerState = { mix: Mix }

type MixerOptions = {
  defaultMix: Mix
  onMixChange?: (mix: Mix, details: ChangeDetails<AreaReason>) => void
}

const mixer = definePrimitive({
  name: "mixer",
  options: { defaultMix: "value", onMixChange: "callback" },
  state: (options: MixerOptions): MixerState => ({ mix: options.defaultMix }),
  api: (context) => {
    const change = createChange(context)
    return {
      area: createArea<MixerState>(context, {
        value: (state) => ({ x: state.mix.warmth, y: state.mix.energy }),
        set: (value, details) => change("mix", { warmth: value.x, energy: value.y }, details),
        x: () => ({ min: 0, max: 100, step: 1, label: "Warmth" }),
        y: () => ({ min: 0, max: 100, step: 1, label: "Energy" }),
      }),
    }
  },
  slots: (slot) => ({
    pad: slot({
      attrs: () => ({ style: "position:relative;touch-action:none;user-select:none" }),
      on: { pointerdown: (event, { el, api }) => api.area.pointerdown(event, el!) },
    }),
    thumb: slot({
      attrs: (state, { api }) => ({ ...api.area.thumbAttrs(state), style: api.area.thumbStyle(state) }),
      on: { keydown: (event, { api }) => api.area.keydown(event) },
    }),
  }),
})

const parts = createParts(mixer, { thumb: "div" })

function Mixer({ defaultMix, onMixChange, ...props }: MixerOptions & PartProps<"div">) {
  const handle = usePrimitive(mixer, { defaultMix, onMixChange })
  return usePart(handle, "pad", {}, props, "div")
}

const MixerThumb = parts.Thumb

function Example() {
  const [mix, setMix] = React.useState({ warmth: 30, energy: 70 })
  return (
    <div data-slot="stack">
      <Mixer defaultMix={mix} onMixChange={setMix}>
        <MixerThumb aria-label="Mix" />
      </Mixer>
      <p data-slot="output">
        Warmth {mix.warmth}, energy {mix.energy}
      </p>
    </div>
  )
}

export { Example, mixer, Mixer, MixerThumb, type Mix, type MixerOptions, type MixerState }
