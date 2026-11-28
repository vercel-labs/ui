import { Component } from "@angular/core"
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui-sdk/angular/alert-dialog"

@Component({
  imports: [
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogClose,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
  ],
  template: `
    <div dir="rtl">
      <ng-container uiAlertDialog>
        <button uiAlertDialogTrigger>حذف الحساب</button>
        <div *uiAlertDialogBackdrop></div>
        <div *uiAlertDialogContent>
          <div data-slot="stack">
            <h2 uiAlertDialogTitle>هل أنت متأكد تمامًا؟</h2>
            <p uiAlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيؤدي إلى حذف حسابك نهائيًا.
            </p>
          </div>
          <div data-slot="row">
            <button uiAlertDialogClose>إلغاء</button>
            <button uiAlertDialogClose data-variant="solid" value="confirm">
              متابعة
            </button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {}

export { Example }
