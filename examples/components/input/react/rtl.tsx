import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import { Input, InputClear, InputGroup } from "@ui-sdk/react/input"
import { SearchIcon, XIcon } from "lucide-react"

export function Example() {
  return (
    <div data-slot="stack" dir="rtl">
      <Field name="name">
        <FieldLabel>الاسم الكامل</FieldLabel>
        <Input placeholder="ليلى حسن" />
        <FieldDescription>كما يظهر في ملفك الشخصي.</FieldDescription>
      </Field>
      <InputGroup>
        <SearchIcon />
        <Input type="search" aria-label="بحث" defaultValue="حسن" />
        <InputClear aria-label="مسح البحث">
          <XIcon />
        </InputClear>
      </InputGroup>
    </div>
  )
}
