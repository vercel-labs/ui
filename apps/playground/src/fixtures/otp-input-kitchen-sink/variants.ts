// Every scenario in the OTP input kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: string
  title: string
  note?: string
  // Plain options, so the web component takes them as attributes.
  options?: {
    defaultValue?: string
    disabled?: boolean
    readOnly?: boolean
    required?: boolean
    textAlign?: "start" | "center" | "end"
    inputMode?: "numeric" | "text" | "decimal" | "tel" | "none"
    name?: string
  }
  // A named pattern, since a regular expression is written differently on the web component.
  pattern?: keyof typeof patterns
  // How many slots each group has. Separators go between groups.
  groups: number[]
  // Controlled by the card: as typed, or uppercased on every change.
  controlled?: "plain" | "uppercase"
  // Cancels every change to a code with this character, so it never gets in.
  cancel?: string
  controller?: boolean
  // Inside a form with submit and reset buttons.
  form?: boolean
  // Marked invalid from the start.
  invalid?: boolean
  // The right code: a complete code that isn't it marks the input invalid.
  verify?: string
  place?: "rtl" | "fieldset"
  // Slots that mask their character, from a render function in React and Vue.
  masked?: boolean
  debug?: boolean
  // What the smoke spec types, and the code it expects after.
  type: string
  expect: string
}

const patterns = {
  digits: "digits",
  letters: "letters",
  alphanumeric: "alphanumeric",
  hex: /[A-Fa-f0-9]/,
} as const

// The pattern as the web component's attribute: a preset's name, or a regular expression's source.
const patternAttribute = (name: keyof typeof patterns) => {
  const pattern = patterns[name]
  return typeof pattern === "string" ? pattern : pattern.source
}

// The value buttons of the controlled variants.
const presets = {
  plain: [
    ["clear", ""],
    ["set 123456", "123456"],
  ],
  uppercase: [
    ["clear", ""],
    ["set abc123", "abc123"],
  ],
} satisfies Record<string, [string, string][]>

const maxLengthOf = (variant: Variant) =>
  variant.groups.reduce((sum, size) => sum + size, 0)

// The first slot index of each group.
const groupStarts = (variant: Variant) =>
  variant.groups.map((_, group) =>
    variant.groups.slice(0, group).reduce((sum, size) => sum + size, 0)
  )

// What the props chips show.
function chipsOf(variant: Variant) {
  return {
    maxLength: maxLengthOf(variant),
    ...variant.options,
    ...(variant.pattern && { pattern: String(patterns[variant.pattern]) }),
    ...(variant.groups.length > 1 && { groups: variant.groups.join("+") }),
    ...(variant.controlled && { controlled: variant.controlled }),
    ...(variant.cancel && { cancels: variant.cancel }),
    ...(variant.invalid && { "aria-invalid": true }),
    ...(variant.verify && { verifies: variant.verify }),
    ...(variant.masked && { masked: true }),
    ...(variant.debug && { debug: true }),
  }
}

const variants: Variant[] = [
  {
    id: "length-4",
    section: "Length",
    title: "maxLength={4}",
    groups: [4],
    type: "1234",
    expect: "1234",
  },
  {
    id: "length-6",
    section: "Length",
    title: "maxLength={6}",
    groups: [6],
    type: "123456",
    expect: "123456",
  },
  {
    id: "length-8",
    section: "Length",
    title: "maxLength={8}",
    groups: [4, 4],
    type: "12345678",
    expect: "12345678",
  },
  {
    id: "length-overflow",
    section: "Length",
    title: "Typing past the end",
    note: "The last slot stays selected, so each extra character replaces it.",
    groups: [4],
    type: "123456",
    expect: "1236",
  },

  {
    id: "pattern-digits",
    section: "Pattern",
    title: 'pattern="digits"',
    note: "Letters are ignored.",
    groups: [6],
    pattern: "digits",
    type: "12ab34cd56",
    expect: "123456",
  },
  {
    id: "pattern-letters",
    section: "Pattern",
    title: 'pattern="letters"',
    groups: [6],
    pattern: "letters",
    type: "ab12cdef",
    expect: "abcdef",
  },
  {
    id: "pattern-alphanumeric",
    section: "Pattern",
    title: 'pattern="alphanumeric"',
    groups: [3, 3],
    pattern: "alphanumeric",
    type: "a1-b2_c3",
    expect: "a1b2c3",
  },
  {
    id: "pattern-regexp",
    section: "Pattern",
    title: "pattern={/[A-Fa-f0-9]/}",
    note: "Hex characters only.",
    groups: [6],
    pattern: "hex",
    type: "beefzz12",
    expect: "beef12",
  },
  {
    id: "input-mode-text",
    section: "Pattern",
    title: 'Digits with inputMode="text"',
    note: "Touch screens show a full keyboard.",
    groups: [6],
    options: { inputMode: "text" },
    type: "123456",
    expect: "123456",
  },
  {
    id: "input-mode-tel",
    section: "Pattern",
    title: 'inputMode="tel"',
    groups: [3, 3],
    options: { inputMode: "tel" },
    type: "123456",
    expect: "123456",
  },

  {
    id: "groups-3-3",
    section: "Groups",
    title: "Two groups of three",
    groups: [3, 3],
    type: "123456",
    expect: "123456",
  },
  {
    id: "groups-2-2-2",
    section: "Groups",
    title: "Three groups of two",
    groups: [2, 2, 2],
    type: "123456",
    expect: "123456",
  },
  {
    id: "groups-singles",
    section: "Groups",
    title: "A separator between every slot",
    groups: [1, 1, 1, 1],
    type: "1234",
    expect: "1234",
  },

  {
    id: "default-value",
    section: "Values",
    title: 'defaultValue="12"',
    groups: [6],
    options: { defaultValue: "12" },
    type: "3456",
    expect: "123456",
  },
  {
    id: "default-value-invalid",
    section: "Values",
    title: 'defaultValue="12ab" with digits',
    note: "Characters that don't fit are dropped.",
    groups: [6],
    options: { defaultValue: "12ab" },
    type: "",
    expect: "12",
  },
  {
    id: "controlled",
    section: "Values",
    title: "Controlled",
    groups: [3, 3],
    controlled: "plain",
    type: "123456",
    expect: "123456",
  },
  {
    id: "controlled-uppercase",
    section: "Values",
    title: "Controlled, uppercased",
    note: "Every change is stored in capitals.",
    groups: [3, 3],
    pattern: "alphanumeric",
    controlled: "uppercase",
    type: "abc123",
    expect: "ABC123",
  },
  {
    id: "canceled",
    section: "Values",
    title: "Cancels every 9",
    groups: [6],
    cancel: "9",
    type: "192939",
    expect: "123",
  },
  {
    id: "controller",
    section: "Values",
    title: "Controller",
    groups: [3, 3],
    controller: true,
    type: "123456",
    expect: "123456",
  },
  {
    id: "verify",
    section: "Values",
    title: "Verified on complete",
    note: "123456 is right. Anything else turns red.",
    groups: [3, 3],
    verify: "123456",
    type: "111111",
    expect: "111111",
  },

  {
    id: "disabled",
    section: "States",
    title: "disabled",
    groups: [6],
    options: { disabled: true, defaultValue: "12" },
    type: "3456",
    expect: "12",
  },
  {
    id: "read-only",
    section: "States",
    title: "readOnly",
    note: "Focusable, but the code can't change.",
    groups: [6],
    options: { readOnly: true, defaultValue: "1234" },
    type: "56",
    expect: "1234",
  },
  {
    id: "fieldset",
    section: "States",
    title: "Inside a disabled fieldset",
    groups: [6],
    options: { defaultValue: "12" },
    place: "fieldset",
    type: "3456",
    expect: "12",
  },
  {
    id: "invalid",
    section: "States",
    title: 'aria-invalid="true"',
    groups: [6],
    options: { defaultValue: "12" },
    invalid: true,
    type: "3456",
    expect: "123456",
  },

  {
    id: "form-required",
    section: "Forms",
    title: "required in a form",
    note: "A partial code doesn't submit. Reset empties it.",
    groups: [3, 3],
    options: { required: true, name: "code" },
    form: true,
    type: "123456",
    expect: "123456",
  },
  {
    id: "form-default",
    section: "Forms",
    title: "Reset returns to defaultValue",
    groups: [4],
    options: { defaultValue: "4242", name: "pin" },
    form: true,
    type: "",
    expect: "4242",
  },

  {
    id: "align-left",
    section: "Layout",
    title: 'textAlign="start"',
    groups: [6],
    options: { textAlign: "start" },
    type: "123456",
    expect: "123456",
  },
  {
    id: "align-center",
    section: "Layout",
    title: 'textAlign="center"',
    groups: [6],
    options: { textAlign: "center" },
    type: "123456",
    expect: "123456",
  },
  {
    id: "align-right",
    section: "Layout",
    title: 'textAlign="end"',
    groups: [6],
    options: { textAlign: "end" },
    type: "123456",
    expect: "123456",
  },
  {
    id: "rtl",
    section: "Layout",
    title: "Right to left",
    note: "The first slot sits on the right.",
    groups: [3, 3],
    place: "rtl",
    type: "123456",
    expect: "123456",
  },
  {
    id: "masked",
    section: "Layout",
    title: "Masked slots",
    note: "React and Vue. A render function draws dots.",
    groups: [4],
    masked: true,
    type: "1234",
    expect: "1234",
  },
  {
    id: "debug",
    section: "Layout",
    title: "debug",
    note: "Logs every change to the console.",
    groups: [4],
    debug: true,
    type: "1234",
    expect: "1234",
  },
]

export {
  chipsOf,
  groupStarts,
  maxLengthOf,
  patternAttribute,
  patterns,
  presets,
  type Variant,
  variants,
}
