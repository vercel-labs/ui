// The form every implementation renders. Labels, names, values and order are
// the contract the specs rely on, so change them here and nowhere else.
//
// Before
// <form "Preferences">
//   Field: checkbox "Accept the terms" (terms=yes, required), description, error
//   FieldSet "Toppings": checkbox group (toppings=…, Cheese at first) with a parent
//   checkbox "All toppings", then Cheese, Mushrooms, Olives
//   Switches "Wi-Fi" (wifi, on at first) and "Airplane mode" (airplane)
//   Field: radio group "Plan" (plan, required): Free, Pro, Team (disabled), Enterprise
//   Field: email input "Email" (email, required), description, error
//   FieldSet "Shipping": checkbox "Gift wrap" (gift)
//   Save (submit), Reset
// </form>
// Checkbox "Newsletter" (newsletter=weekly), outside the form, joined to it with `form`
// Toggle shipping (disables the Shipping fieldset)
// After
// Status "Last action", status "Submitted"
const formsFixture = {
  formLabel: "Preferences",
  formId: "preferences",
  terms: {
    label: "Accept the terms",
    name: "terms",
    value: "yes",
    description: "You must accept them to continue.",
    error: "Accept the terms to continue.",
  },
  toppings: {
    legend: "Toppings",
    legendId: "toppings-legend",
    parent: "All toppings",
    name: "toppings",
    // Cheese is checked at first.
    defaultValue: ["cheese"],
    items: [
      { value: "cheese", label: "Cheese" },
      { value: "mushrooms", label: "Mushrooms" },
      { value: "olives", label: "Olives" },
    ],
  },
  switches: [
    { name: "wifi", label: "Wi-Fi", defaultChecked: true },
    { name: "airplane", label: "Airplane mode", defaultChecked: false },
  ],
  plan: {
    label: "Plan",
    name: "plan",
    description: "You can change it later.",
    items: [
      { value: "free", label: "Free" },
      { value: "pro", label: "Pro" },
      { value: "team", label: "Team", disabled: true },
      { value: "enterprise", label: "Enterprise" },
    ],
  },
  email: { label: "Email", name: "email", description: "We never share it." },
  // Rendered with ?nickname: a required field with no error part.
  nickname: { label: "Nickname", name: "nickname" },
  shipping: { legend: "Shipping", label: "Gift wrap", name: "gift" },
  newsletter: { label: "Newsletter", name: "newsletter", value: "weekly" },
}

// Options a spec can set through the URL:
// ?plan=pro checks Pro at first, ?readonly makes the terms and plan read-only,
// ?disabled disables the plan group, ?invalid marks the email field invalid
// from outside, ?invalid=false never shows it as invalid, ?cancel=<name>
// cancels changes to that control, ?loop=false stops arrow keys at the ends,
// ?controlled renders the terms checkbox controlled, ?toppings-required
// requires at least one topping, ?nickname adds a required Nickname field after
// Email that has no error part.
function formsOptions() {
  const params = new URLSearchParams(location.search)
  return {
    plan: params.get("plan") ?? undefined,
    readOnly: params.has("readonly"),
    disabled: params.has("disabled"),
    invalid:
      params.get("invalid") === "false"
        ? false
        : params.has("invalid") || undefined,
    cancel: params.get("cancel"),
    loop: params.get("loop") === "false" ? false : undefined,
    controlled: params.has("controlled"),
    toppingsRequired: params.has("toppings-required"),
    nickname: params.has("nickname"),
  }
}

// What a form would submit, as a query string.
function serialize(form: HTMLFormElement) {
  return new URLSearchParams(
    new FormData(form) as unknown as Record<string, string>
  ).toString()
}

export { formsFixture, formsOptions, serialize }
