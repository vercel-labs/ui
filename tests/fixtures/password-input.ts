// What every Password Input fixture renders. Labels, names and order are the
// contract the specs rely on, so change them here and nowhere else.
const passwordInputFixture = {
  // A sign-in form, named by its aria-label, with the field in a Field.
  // Its fields are in a fieldset, which a spec disables.
  form: {
    label: "Sign in",
    account: "Account",
    submit: "Sign in",
    reset: "Reset",
  },
  email: { label: "Email", name: "email", defaultValue: "ada@example.com" },
  password: {
    label: "Password",
    description: "At least 8 characters.",
    name: "password",
    // The toggle's name says what it does. `aria-pressed` says whether it's done.
    toggle: "Show password",
    capsLock: "Caps Lock is on",
  },
  // A button outside the field that shows and hides it through the controller.
  controller: "Reveal with controller",
}

// What the "Last action" status says after a change.
const passwordInputAction = {
  visible: (visible: boolean, reason: string) =>
    `visible: ${visible} (${reason})`,
  submit: (type: string) => `submitted as ${type}`,
}

// Options a spec can set through the URL: ?default-visible, ?disabled,
// ?read-only, ?new-password, ?controlled (the fixture owns `visible`) and
// ?cancel (every visibility change is canceled).
function passwordInputOptions() {
  const params = new URLSearchParams(location.search)
  return {
    defaultVisible: params.has("default-visible") || undefined,
    disabled: params.has("disabled") || undefined,
    readOnly: params.has("read-only") || undefined,
    autoComplete: params.has("new-password")
      ? ("new-password" as const)
      : undefined,
    controlled: params.has("controlled"),
    cancel: params.has("cancel"),
  }
}

export { passwordInputAction, passwordInputFixture, passwordInputOptions }
