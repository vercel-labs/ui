import { Component } from "@angular/core"
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/angular/dialog"

@Component({
  imports: [
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
  ],
  template: `
    <div dir="rtl">
      <ng-container uiDialog>
        <button uiDialogTrigger>تعديل الملف الشخصي</button>
        <div *uiDialogBackdrop></div>
        <div *uiDialogContent>
          <div data-slot="stack">
            <h2 uiDialogTitle>تعديل الملف الشخصي</h2>
            <p uiDialogDescription>أجرِ التغييرات على ملفك الشخصي هنا.</p>
          </div>
          <label data-slot="label">
            الاسم
            <input value="بيدرو دوارتي" />
          </label>
          <div data-slot="row">
            <button uiDialogClose>إلغاء</button>
            <button uiDialogClose data-variant="solid" value="save">حفظ</button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {}

export { Example }
