import { Button } from "@ui-sdk/react/button"
import { ChevronRight } from "lucide-react"

export function Example() {
  return (
    <div data-slot="row" dir="rtl">
      <Button>
        متابعة
        <ChevronRight />
      </Button>
      <Button>إلغاء</Button>
    </div>
  )
}
