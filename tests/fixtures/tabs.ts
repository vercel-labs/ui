// The tabs every implementation renders. Labels, values and order are the
// contract the specs rely on, so change them here and nowhere else.
type TabsFixtureTab = {
  value: string
  label: string
  content: string
  disabled?: boolean
  // A labelled text field inside the panel, after its content.
  field?: string
}

const tabsFixture = {
  // The tab list's accessible name.
  label: "Settings",
  defaultValue: "account",
  tabs: [
    {
      value: "account",
      label: "Account",
      content: "Manage your account details.",
    },
    {
      value: "password",
      label: "Password",
      content: "Change your password.",
      field: "Current password",
    },
    {
      value: "billing",
      label: "Billing",
      content: "Billing is managed by your organization.",
      disabled: true,
    },
    {
      value: "notifications",
      label: "Notifications",
      content: "Choose what we email you about.",
    },
  ] satisfies TabsFixtureTab[] as TabsFixtureTab[],
}

export { tabsFixture, type TabsFixtureTab }
