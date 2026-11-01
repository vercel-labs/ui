import "@ui-sdk/web/field"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field-set>
      <fieldset data-slot="stack" dir="rtl">
        <legend>العنوان</legend>
        <ui-field-description>نحتاج عنوانك لتوصيل طلبك.</ui-field-description>
        <ui-field name="street">
          <ui-field-label>الشارع</ui-field-label>
          <input />
        </ui-field>
        <ui-field name="city">
          <ui-field-label>المدينة</ui-field-label>
          <input />
        </ui-field>
      </fieldset>
    </ui-field-set>
  `
}
