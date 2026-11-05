import { Checkbox } from "@ui-sdk/react/checkbox"
import { Label } from "@ui-sdk/react/label"
import { NumberInput, NumberInputControl } from "@ui-sdk/react/number-input"
import { Radio, RadioGroup } from "@ui-sdk/react/radio"
import { Slider, SliderControl, SliderThumb, SliderTrack } from "@ui-sdk/react/slider"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { labelFixture } from "tests/fixtures/label.ts"

const { email, plan, volume, terms, region, delivery, quantity } = labelFixture

function Group({
  group,
  ...props
}: { group: typeof plan | typeof region } & React.ComponentProps<typeof RadioGroup>) {
  return (
    <RadioGroup id={group.id} className="radio-group" {...props}>
      {group.items.map((item) => (
        <Radio key={item.value} className="radio" value={item.value}>
          {item.label}
        </Radio>
      ))}
    </RadioGroup>
  )
}

function Fixture() {
  const [shown, setShown] = React.useState(false)
  return (
    <div className="fixture">
      <button>Before</button>
      <Label htmlFor={email.id}>{email.label}</Label>
      <input id={email.id} />
      <Label htmlFor={plan.id}>{plan.label}</Label>
      <Group group={plan} defaultValue={plan.defaultValue} />
      <Label htmlFor={volume.id}>{volume.label}</Label>
      <Slider id={volume.id} className="slider" defaultValue={volume.defaultValue}>
        <SliderControl>
          <SliderTrack className="slider-track">
            <SliderThumb className="slider-thumb" />
          </SliderTrack>
        </SliderControl>
      </Slider>
      <Label>
        <Checkbox className="checkbox" />
        {terms.label}
      </Label>
      <Label htmlFor={region.id}>{region.label}</Label>
      <Group group={region} disabled />
      <Label htmlFor={delivery.id}>{delivery.label}</Label>
      <Group group={delivery} aria-label={delivery.name} />
      <Label htmlFor={quantity.id}>{quantity.label}</Label>
      {shown ? (
        <NumberInput id={quantity.id} defaultValue={quantity.defaultValue}>
          <NumberInputControl />
        </NumberInput>
      ) : (
        <button onClick={() => setShown(true)}>{quantity.show}</button>
      )}
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>,
  )
}

export { Fixture, mount }
