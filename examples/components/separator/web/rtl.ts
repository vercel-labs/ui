import "@ui-sdk/web/separator"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack" dir="rtl">
      <div data-slot="stack">
        <div>الحساب</div>
        <p data-slot="hint">إدارة ملفك الشخصي وتفضيلاتك.</p>
      </div>
      <ui-separator></ui-separator>
      <div data-slot="row">
        <div>الملف الشخصي</div>
        <ui-separator orientation="vertical"></ui-separator>
        <div>الفوترة</div>
        <ui-separator orientation="vertical"></ui-separator>
        <div>الإعدادات</div>
      </div>
    </div>
  `
}
