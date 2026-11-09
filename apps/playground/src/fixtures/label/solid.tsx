import { Checkbox } from "@ui-sdk/solid/checkbox"
import { Label } from "@ui-sdk/solid/label"
import { NumberInput, NumberInputControl } from "@ui-sdk/solid/number-input"
import { Radio, RadioGroup } from "@ui-sdk/solid/radio"
import {
  Slider,
  SliderControl,
  SliderThumb,
  SliderTrack,
} from "@ui-sdk/solid/slider"
import { render } from "@solidjs/web"
import { createSignal, For, omit, Show, type ComponentProps } from "solid-js"
import { labelFixture } from "tests/fixtures/label.ts"

const { email, plan, volume, terms, region, delivery, quantity } = labelFixture

function Group(
  props: { group: typeof plan | typeof region } & ComponentProps<
    typeof RadioGroup
  >
) {
  const rest = omit(props, "group")
  return (
    <RadioGroup id={props.group.id} class="radio-group" {...rest}>
      <For each={props.group.items}>
        {(item) => (
          <Radio class="radio" value={item.value}>
            {item.label}
          </Radio>
        )}
      </For>
    </RadioGroup>
  )
}

function Fixture() {
  const [shown, setShown] = createSignal(false)
  return (
    <div class="fixture">
      <button>Before</button>
      <Label for={email.id}>{email.label}</Label>
      <input id={email.id} />
      <Label for={plan.id}>{plan.label}</Label>
      <Group group={plan} defaultValue={plan.defaultValue} />
      <Label for={volume.id}>{volume.label}</Label>
      <Slider id={volume.id} class="slider" defaultValue={volume.defaultValue}>
        <SliderControl>
          <SliderTrack class="slider-track">
            <SliderThumb class="slider-thumb" />
          </SliderTrack>
        </SliderControl>
      </Slider>
      <Label>
        <Checkbox class="checkbox" />
        {terms.label}
      </Label>
      <Label for={region.id}>{region.label}</Label>
      <Group group={region} disabled />
      <Label for={delivery.id}>{delivery.label}</Label>
      <Group group={delivery} aria-label={delivery.name} />
      <Label for={quantity.id}>{quantity.label}</Label>
      <Show
        when={shown()}
        fallback={
          <button onClick={() => setShown(true)}>{quantity.show}</button>
        }
      >
        <NumberInput id={quantity.id} defaultValue={quantity.defaultValue}>
          <NumberInputControl />
        </NumberInput>
      </Show>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
