import { Component } from "@angular/core"
import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@ui-sdk/angular/resizable"

@Component({
  imports: [Resizable, ResizableHandle, ResizablePanel],
  template: `
    <div dir="rtl">
      <div uiResizable>
        <div uiResizablePanel [defaultSize]="35" [minSize]="20">
          <h3>الملفات</h3>
          <ul>
            <li>page.tsx</li>
            <li>layout.tsx</li>
            <li>globals.css</li>
          </ul>
        </div>
        <div uiResizableHandle aria-label="تغيير حجم الملفات"></div>
        <div uiResizablePanel [defaultSize]="65" [minSize]="40">
          <div uiResizable orientation="vertical">
            <div uiResizablePanel [defaultSize]="60" [minSize]="30">
              <h3>page.tsx</h3>
              <span data-slot="hint">حُفظ للتو</span>
            </div>
            <div uiResizableHandle aria-label="تغيير حجم المحرر"></div>
            <div uiResizablePanel [defaultSize]="40" [minSize]="30">
              <h3>الطرفية</h3>
              <span data-slot="hint">جاهز على المنفذ 3000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
