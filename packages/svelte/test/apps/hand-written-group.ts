import { definePrimitive } from "@ui-sdk/core"

const shell = definePrimitive({
  name: "shell",
  options: {},
  state: () => ({}),
  api: () => ({}),
  slots: (slot) => ({
    root: slot({}),
    group: slot<{ value?: string }>({ props: { value: "string" } }),
    item: slot<{ value?: string }>({
      props: { value: { kind: "string", from: "group" } },
      attrs: (_state, { props }) => ({ "data-group": String(props.value) }),
    }),
  }),
  agent: { actions: [] },
})

export { shell }
