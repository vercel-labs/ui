import { slider } from "@ui-sdk/core/slider"
import { createParts } from "../src/use-primitive"

const { Root: Slider } = createParts(slider, { root: "div" })
declare const volume: number

// One thumb: `T` is a number.
;<Slider
  value={volume}
  onValueChange={(value) => {
    const known: number = value
    // @ts-expect-error `value` is a number, not a list.
    const wrong: number[] = value
    void known
    void wrong
  }}
/>
// A range: `T` is a list, and reaches `onValueCommit` too.
;<Slider
  defaultValue={[20, 80]}
  onValueCommit={(value) => {
    const known: number[] = value
    // @ts-expect-error `value` is a list.
    const wrong: number = value
    void known
    void wrong
  }}
/>
// Without a value, it's either.
;<Slider
  onValueChange={(value) => (typeof value === "number" ? value : value[0])}
/>
// @ts-expect-error Values are numbers.
;<Slider value="50" />
