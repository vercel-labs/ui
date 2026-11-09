import {
  createRatingController,
  Rating,
  RatingItem,
} from "@ui-sdk/solid/rating"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"
import { ratingOptions } from "tests/fixtures/page.ts"
import { ratingFixture } from "tests/fixtures/rating.ts"

const { quality, value, average } = ratingFixture
const controller = createRatingController()

const entries = (form: HTMLFormElement) =>
  Array.from(new FormData(form), ([key, entry]) => `${key}=${entry}`).join("&")

function Fixture() {
  const [action, setAction] = createSignal("")
  const [submitted, setSubmitted] = createSignal("")
  const { cancel, disabled } = ratingOptions()
  return (
    <form
      class="fixture"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(entries(event.currentTarget))
      }}
    >
      <button type="button">Before</button>
      <Rating
        aria-label={quality.label}
        name={quality.name}
        defaultValue={quality.defaultValue}
        disabled={disabled}
        controller={controller}
        onValueChange={(score, details) => {
          if (score === cancel) {
            return details.cancel()
          }
          setAction(`${score}:${details.reason}`)
        }}
      >
        <RatingItem>
          {(state) => <span class="star">{state.fill}</span>}
        </RatingItem>
      </Rating>
      <button type="button">After</button>
      <Rating
        aria-label={value.label}
        name={value.name}
        step={value.step}
        deselectable
      />
      <Rating
        value={average.value}
        getValueLabel={average.getValueLabel}
        readOnly
      />
      <button type="submit">Save</button>
      <button type="reset">Reset</button>
      <button type="button" onClick={() => controller.setValue(5)}>
        Rate five
      </button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <output aria-label="Submitted">{submitted()}</output>
    </form>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
