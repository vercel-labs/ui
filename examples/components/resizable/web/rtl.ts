import "@ui-sdk/web/resizable"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div dir="rtl">
      <ui-resizable>
        <ui-resizable-panel default-size="50">واحد</ui-resizable-panel>
        <ui-resizable-handle aria-label="تغيير حجم واحد"><div></div></ui-resizable-handle>
        <ui-resizable-panel default-size="50">
          <ui-resizable orientation="vertical">
            <ui-resizable-panel default-size="25">اثنان</ui-resizable-panel>
            <ui-resizable-handle aria-label="تغيير حجم اثنان"><div></div></ui-resizable-handle>
            <ui-resizable-panel default-size="75">ثلاثة</ui-resizable-panel>
          </ui-resizable>
        </ui-resizable-panel>
      </ui-resizable>
    </div>
  `
}

export { mount }
