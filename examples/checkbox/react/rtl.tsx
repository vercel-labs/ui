import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox"
import { Check } from "lucide-react"

export function Example() {
  return (
    <div data-slot="stack" dir="rtl">
      <label data-slot="label">
        <Checkbox>
          <CheckboxIndicator>
            <Check />
          </CheckboxIndicator>
        </Checkbox>
        قبول الشروط والأحكام
      </label>
      <label data-slot="label">
        <Checkbox defaultChecked>
          <CheckboxIndicator>
            <Check />
          </CheckboxIndicator>
        </Checkbox>
        تفعيل الإشعارات
      </label>
    </div>
  )
}
