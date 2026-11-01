import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox"
import { Check, Plus } from "lucide-react"

const topics = [
  { value: "design", label: "Design", checked: true },
  { value: "engineering", label: "Engineering", checked: false },
  { value: "marketing", label: "Marketing", checked: false },
  { value: "sales", label: "Sales", checked: false },
]

export function Example() {
  return (
    <div data-slot="stack">
      <fieldset>
        <legend>Topics you follow</legend>
        <div data-slot="row">
          {topics.map((topic) => (
            <Checkbox
              key={topic.value}
              name="topics"
              value={topic.value}
              defaultChecked={topic.checked}
              render={(props, state) => (
                <button {...props}>
                  {state.checked ? <Check /> : <Plus />}
                  {topic.label}
                </button>
              )}
            />
          ))}
        </div>
      </fieldset>
      <label data-slot="label">
        <Checkbox render={<span />}>
          <CheckboxIndicator>
            <Check />
          </CheckboxIndicator>
        </Checkbox>
        Notify me about new topics
      </label>
    </div>
  )
}
