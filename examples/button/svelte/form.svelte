<script lang="ts">
  import { Button } from "@ui-sdk/svelte/button"
  let submitted = $state<{ email: string; count: number }>()

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    const email = String(new FormData(event.currentTarget as HTMLFormElement).get("email"))
    submitted = { email, count: (submitted?.count ?? 0) + 1 }
  }
</script>

<form data-slot="stack"
  onsubmit={onSubmit}
  onreset={() => (submitted = undefined)}
>
  <label data-slot="label">
    Email
    <input
      name="email"
      type="email"
      value="ada@example.com"
    />
  </label>
  <div data-slot="row">
    <Button
      type="submit"
    >Subscribe</Button>
    <Button
      type="reset"
    >Reset</Button>
  </div>
  <output data-slot="output">{submitted ? `Submitted: ${submitted.email} (${submitted.count} ${submitted.count === 1 ? "time" : "times"})` : ""}</output>
</form>
