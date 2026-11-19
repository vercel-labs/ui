// What the agent reach fixture renders: a region per way a page keeps content
// from a person, each with a field named `<name> field` and a button named
// `<name> button`. The names are the contract the spec relies on.
const agentReachFixture = {
  shown: "Shown",
  // Regions a person can't see, by what hides them.
  hidden: [
    {
      name: "Display none",
      how: "display: none",
      props: { style: { display: "none" } },
    },
    {
      name: "Visibility hidden",
      how: "visibility: hidden",
      props: { style: { visibility: "hidden" } },
    },
    {
      name: "Content visibility",
      how: "content-visibility: hidden",
      props: { style: { contentVisibility: "hidden" } },
    },
    {
      name: "Hidden attribute",
      how: "a hidden element",
      props: { hidden: true },
    },
    {
      name: "Aria hidden",
      how: 'aria-hidden="true"',
      props: { "aria-hidden": true },
    },
    {
      name: "Agent hidden",
      how: "data-agent-hidden",
      props: { "data-agent-hidden": "" },
    },
    { name: "Details", how: "a closed details element", props: {} },
  ],
  inert: "Inert",
  dialog: { trigger: "Open dialog", title: "Dialog", name: "Dialog" },
} as const

export { agentReachFixture }
