import { Separator } from "@ui-sdk/solid/separator"

export function Example() {
  return (
    <div data-slot="row">
      <span>Profile</span>
      <Separator orientation="vertical" />
      <span>Billing</span>
      <Separator orientation="vertical" />
      <span>Settings</span>
    </div>
  )
}
