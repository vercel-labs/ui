"use client"

import * as React from "react"
import { Button } from "@ui-sdk/react/button"

function Example() {
  const [submitted, setSubmitted] = React.useState<{ email: string; count: number }>()

  return (
    <form
      data-slot="stack"
      onSubmit={(event) => {
        event.preventDefault()
        const email = String(new FormData(event.currentTarget).get("email"))
        setSubmitted((current) => ({ email, count: (current?.count ?? 0) + 1 }))
      }}
      onReset={() => setSubmitted(undefined)}
    >
      <label data-slot="label">
        Email
        <input name="email" type="email" defaultValue="ada@example.com" />
      </label>
      <div data-slot="row">
        <Button type="submit">Subscribe</Button>
        <Button type="reset">Reset</Button>
      </div>
      <output data-slot="output">
        {submitted &&
          `Submitted: ${submitted.email} (${submitted.count} ${submitted.count === 1 ? "time" : "times"})`}
      </output>
    </form>
  )
}

export { Example }
