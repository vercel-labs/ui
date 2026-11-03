import { Field, FieldControl, FieldDescription, FieldLabel, FieldLegend, FieldSet } from "@ui-sdk/solid/field"

export function Example() {
  return (
    <FieldSet dir="rtl">
      <FieldLegend>العنوان</FieldLegend>
      <FieldDescription>نحتاج عنوانك لتوصيل طلبك.</FieldDescription>
      <Field name="street">
        <FieldLabel>الشارع</FieldLabel>
        <FieldControl />
      </Field>
      <Field name="city">
        <FieldLabel>المدينة</FieldLabel>
        <FieldControl />
      </Field>
    </FieldSet>
  )
}
