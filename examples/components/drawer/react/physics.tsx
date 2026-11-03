"use client"

import * as React from "react"
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerTitle,
  DrawerTrigger,
  sheetPhysics,
  type SheetPhysics,
} from "@ui-sdk/react/drawer"

const presets: { label: string; physics: Partial<SheetPhysics> }[] = [
  { label: "iOS", physics: sheetPhysics.ios },
  { label: "Bouncy", physics: { dampingRatio: 0.6, momentumDampingRatio: 0.5 } },
  { label: "Slow", physics: { response: 0.7 } },
  { label: "Loose", physics: { rubberBand: 0.6, rubberBandDimension: null } },
]

function Example() {
  const [preset, setPreset] = React.useState(presets[1])
  return (
    <div data-slot="stack">
      <fieldset data-slot="row">
        <legend>physics</legend>
        {presets.map((option) => (
          <label data-slot="label" key={option.label}>
            <input
              type="radio"
              name="drawer-physics"
              checked={preset === option}
              onChange={() => setPreset(option)}
            />
            {option.label}
          </label>
        ))}
      </fieldset>
      <Drawer physics={preset.physics} snapPoints={[0.4, 1]} driver="pointer">
        <DrawerTrigger>Try the physics</DrawerTrigger>
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHandle aria-label="Resize" />
          <div data-slot="stack">
            <DrawerTitle>{preset.label}</DrawerTitle>
            <DrawerDescription>Fling it up and down, and pull it past the top.</DrawerDescription>
          </div>
          <pre data-slot="log">{JSON.stringify({ ...sheetPhysics.ios, ...preset.physics }, null, 2)}</pre>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export { Example }
