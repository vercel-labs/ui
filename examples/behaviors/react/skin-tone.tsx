import * as React from "react"
import { createLocalStorage, createPreference } from "@ui-sdk/core"
import { Preferences, usePreference } from "@ui-sdk/react/preferences"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio"

const tones = [
  { value: "default", label: "Default", wave: "👋" },
  { value: "light", label: "Light", wave: "👋🏻" },
  { value: "medium-light", label: "Medium light", wave: "👋🏼" },
  { value: "medium", label: "Medium", wave: "👋🏽" },
  { value: "medium-dark", label: "Medium dark", wave: "👋🏾" },
  { value: "dark", label: "Dark", wave: "👋🏿" },
] as const

type Tone = (typeof tones)[number]["value"]

const skinTone = createPreference({
  values: tones.map((tone) => tone.value),
  defaultValue: "default",
  attribute: "data-skin-tone",
  storage: createLocalStorage("ui-sdk-skin-tone"),
})

// Shows a version only where `data-skin-tone` matches it. Written out, so Tailwind finds every class.
const shown: Record<Tone, string> = {
  default: "[[data-skin-tone=default]_&]:inline",
  light: "[[data-skin-tone=light]_&]:inline",
  "medium-light": "[[data-skin-tone=medium-light]_&]:inline",
  medium: "[[data-skin-tone=medium]_&]:inline",
  "medium-dark": "[[data-skin-tone=medium-dark]_&]:inline",
  dark: "[[data-skin-tone=dark]_&]:inline",
}

// Every tone is in the HTML, and CSS shows the one that matches, so the hand
// is right before the page hydrates.
function Wave() {
  return (
    <span role="img" aria-label="Waving hand" className="text-3xl leading-none">
      {tones.map((tone) => (
        <span key={tone.value} aria-hidden="true" className={`hidden ${shown[tone.value]}`}>
          {tone.wave}
        </span>
      ))}
    </span>
  )
}

function TonePicker() {
  const { value } = usePreference(skinTone)
  return (
    <RadioGroup
      aria-label="Preferred default emoji skin tone"
      value={value}
      onValueChange={(next, details) => {
        if (next) skinTone.set(next, { reason: "item-press", event: details.event })
      }}
      className="flex flex-wrap items-center gap-x-4 gap-y-3"
    >
      {tones.map((tone) => (
        <label key={tone.value} className="flex items-center gap-2 text-xl leading-none">
          <Radio
            value={tone.value}
            aria-label={tone.label}
            className="relative flex size-4 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent bg-input/90 outline-none transition-shadow after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-checked:bg-primary data-checked:text-primary-foreground data-disabled:cursor-default data-disabled:opacity-50 motion-reduce:transition-none"
          >
            <RadioIndicator className="size-2 rounded-full bg-primary-foreground" />
          </Radio>
          <span aria-hidden="true">{tone.wave}</span>
        </label>
      ))}
    </RadioGroup>
  )
}

function Example() {
  return (
    <Preferences preferences={[skinTone]}>
      <div className="flex w-[26rem] max-w-full flex-col gap-5 rounded-3xl bg-card p-5 text-sm text-card-foreground shadow-sm ring-1 ring-foreground/5 dark:ring-foreground/10">
        <div className="flex items-center gap-3">
          <Wave />
          <div className="flex flex-col gap-0.5">
            <span className="text-base font-medium">Welcome back</span>
            <span className="text-muted-foreground">Emoji in your messages use your skin tone.</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <span className="font-medium">Preferred default emoji skin tone</span>
          <TonePicker />
        </div>
      </div>
    </Preferences>
  )
}

export { Example, skinTone }
