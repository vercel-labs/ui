// What every OTP Input fixture renders. Labels, values and order are the
// contract the specs rely on, so change them here and nowhere else.
const otpInputFixture = {
  // Six digits in two groups of three, in a form that submits it as "code".
  code: { label: "Verification code", name: "code", length: 6, groups: [3, 3] },
  // Four letters or digits.
  recovery: { label: "Recovery code", length: 4 },
  form: { label: "Verify", submit: "Verify", reset: "Reset" },
  // "Fill code" sets this through a controller, and "Clear code" empties it.
  filled: "654321",
}

// What the "Last action" status says.
const otpInputAction = {
  change: (value: string, reason: string) =>
    `code: ${value || "empty"} (${reason})`,
  complete: (value: string) => `complete: ${value}`,
}

// Options a spec can set through the URL: ?default=<code> starts with a code,
// ?disabled disables the code, ?required requires it, and ?cancel=<char>
// cancels any change that adds that character.
function otpInputOptions() {
  const params = new URLSearchParams(location.search)
  return {
    defaultValue: params.get("default") ?? undefined,
    disabled: params.has("disabled"),
    required: params.has("required"),
    cancel: params.get("cancel"),
  }
}

export { otpInputAction, otpInputFixture, otpInputOptions }
