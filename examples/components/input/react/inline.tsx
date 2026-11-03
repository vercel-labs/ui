import { Input } from "@ui-sdk/react/input"

export function Example() {
  return (
    <form data-slot="row" role="search" onSubmit={(event) => event.preventDefault()}>
      <Input type="search" name="q" aria-label="Search" placeholder="Search…" />
      <button type="submit">Search</button>
    </form>
  )
}
