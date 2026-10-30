"use client"

import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  createConfirm,
  type ConfirmOptions,
} from "@ui-sdk/react/alert-dialog"
import { buttonVariants } from "./button"

const confirm = createConfirm<ConfirmOptions>()

function Confirmer() {
  return (
    <AlertDialog controller={confirm.controller}>
      <AlertDialogContent<ConfirmOptions> className="fixed top-1/2 left-1/2 grid w-full max-w-[calc(100%-2rem)] -translate-1/2 gap-4 rounded-[min(var(--radius-4xl),24px)] bg-popover p-6 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 backdrop:bg-black/30 supports-backdrop-filter:backdrop:backdrop-blur-sm data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 sm:max-w-sm motion-reduce:transition-none dark:ring-foreground/10">
        {({ payload }) => (
          <>
            <AlertDialogTitle className="text-base font-medium">{payload?.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {payload?.description}
            </AlertDialogDescription>
            <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <AlertDialogClose className={buttonVariants()}>
                {payload?.cancelLabel ?? "Cancel"}
              </AlertDialogClose>
              <AlertDialogClose value="confirm" className={buttonVariants({ variant: "destructive" })}>
                {payload?.confirmLabel ?? "Continue"}
              </AlertDialogClose>
            </div>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { confirm, Confirmer }
