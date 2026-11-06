# Make it agent-ready

An app built with ui-sdk can let an agent read its components and call their actions directly, through `createAgent`, instead of clicking through the page. An interface is agent-ready when an agent can find every control by name, call what it needs, and the app sees each change as the agent's and can refuse it.

The full docs are the Agents pages: `docs/agents.md` in each package, or https://ui-sdk.dev/docs/agents.

## The checklist

1. **Every control has a name.** The bridge's `label` is the accessible name: `FieldLabel`, the component's label part, or `aria-label`. Labels should be unique where they sit, because a step finds its component by label (`{ ref: "Project name", … }`). Two "Name" fields in two sections are fine only if a step can still tell them apart by ref or row text. Components that only support another still show up: give a shared Tooltip or an Avatar its own `aria-label`, or put `data-agent-hidden` on it. A Trigger Menu takes its field's label, so give it an `aria-label` of its own, like "Mention suggestions".
2. **Every control an agent should use is one of our parts.** `snapshot()` lists only ui-sdk components. These are invisible, so an agent can't fill or press them:
   - a plain `<button>`: use `Button` (`<ui-button><button>…</button></ui-button>` in web components), including submit buttons and a wizard's Back and Continue;
   - a bare `<input>`, `<textarea>` or `<select>`, and `FieldControl`: use `Input`, `Textarea`, `NumberInput` or `Select` inside a `Field`. In web components that's `<ui-field>` with `<ui-input><input /></ui-input>` inside, never a bare `<input>`;
   - a custom primitive's step it can't take, like a linear stepper's next step: make the action that completes it (the Continue button) one of ours too.
3. **State flows through change callbacks.** Keep app state in sync through `onValueChange` (and the other `on<Key>Change` callbacks), not through DOM listeners. Agent changes call the component's API, not keyboard or pointer handlers, so checks in `onKeyDown` or `onClick` never see them. In the callback, `details.source === "agent"` tells an agent's change apart, and `details.cancel()` refuses it.
4. **Mark what needs a person.** Three attributes, and only these three:
   - `data-agent-confirm="<what it does>"` on anything an agent must not do alone, like delete, pay or send. It covers the element and everything inside it. Write the sentence for the person who'll be asked: "Deletes the project and all its files".
   - `data-agent-secret` on a field whose value an agent may fill but never read. Password, card and one-time-code fields are already secret.
   - `data-agent-hidden` on a region an agent shouldn't see at all, like recovery codes.
5. **Your own primitives say what they do.** Every `definePrimitive` ends with an `agent` key:

   ```ts
   agent: { actions: ["rate"] },
   ```

   | Key                         | Use it when                                                                                                                         |
   | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
   | `actions`                   | Always. The api methods an agent may call. Without it, only methods named like `setValue`, `open`, `toggle` or `clear` are offered. |
   | `closed: true`              | The value is always one of its items, like a size picker. A step that names another item is refused with the real ones.             |
   | `items: (api) => …`         | The items aren't in the state's `items`.                                                                                            |
   | `reveals: true`             | Closed items hide other components, like tabs or an accordion.                                                                      |
   | `shown: (state) => boolean` | It only matters sometimes, like a field wrapper while it has errors.                                                                |
   | `secret: true`              | Its value must never be read, like a PIN.                                                                                           |

## Connect the bridge

Create the bridge once, in the browser, from the same package as the components:

| Framework      | Import                                               |
| -------------- | ---------------------------------------------------- |
| React          | `import { createAgent } from "@ui-sdk/react/agent"`  |
| Vue            | `import { createAgent } from "@ui-sdk/vue/agent"`    |
| Svelte         | `import { createAgent } from "@ui-sdk/svelte/agent"` |
| Solid          | `import { createAgent } from "@ui-sdk/solid/agent"`  |
| Web components | `import { createAgent } from "@ui-sdk/web/agent"`    |

```ts
import { agentTools, createAgent, registerTools } from "@ui-sdk/react/agent"

const agent = createAgent({
  allow: (step, { signal }) => (step.confirm ? askThePerson(step.confirm, { signal }) : true),
})

export { agent }
```

- `agent.snapshot()` lists the components, their state and their `actions`. `agent.act({ steps })` runs steps in order. `agent.query({ text, within, kind })` finds components and list items.
- **Your own model:** `agentTools` has the three tools' names, descriptions and JSON Schemas. Route each tool call to the matching method on `agent` and return its result.
- **A browser agent (WebMCP):** `const unregister = registerTools(agent, { allow })`. It does nothing in a browser without `document.modelContext`. `allow` is required here, since you didn't write that agent.
- `allow` returns `true`, `false`, or a `Promise<boolean>` for your own confirmation UI. Without it, steps on `data-agent-confirm` fail with "Needs a person".
- In Next.js and other server rendering setups, create the bridge in client code only, like a `"use client"` module imported by a client component.

## Prove it with a test

Write this test for every interface you build. It runs in jsdom with the framework's testing library, after the [jsdom stubs](testing.md#jsdom), since a Select opens to resolve an item by its label. This is React; the other frameworks render the same way their own tests do:

```tsx
import { render, screen } from "@testing-library/react"
import { createAgent } from "@ui-sdk/react/agent"
import { expect, test } from "vitest"
import { ProjectSettings } from "./project-settings"

test("an agent can find and change every setting", async () => {
  const agent = createAgent()
  render(<ProjectSettings />)

  const components = agent.snapshot().filter((entry) => !entry.offPage && entry.component !== "more")
  for (const entry of components) {
    expect(entry.label, `${entry.component} ${entry.ref} has no name`).toBeTruthy()
  }
  const labels = components.map((entry) => entry.label)
  for (const label of ["Project name", "Visibility", "Weekly digest"]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label)
  }

  const result = await agent.act({
    steps: [
      { ref: "Project name", action: "setValue", args: ["Atlas"] },
      { ref: "Visibility", action: "setValue", args: ["Internal"] },
    ],
  })
  expect(result.ok, result.error?.message).toBe(true)
  expect(screen.getByLabelText<HTMLInputElement>("Project name").value).toBe("Atlas")
})
```

- Create one bridge per test file: it has no `destroy`, and it remembers components earlier tests removed as `offPage`.
- List every control the task names in the `labels` check, so a control the bridge can't see fails the test. Add one `act` step for every control the task names, using the words a person would use. If a step fails, its `error.message` says why, like an ambiguous label with each match's ref.
- For a `data-agent-confirm` control, assert the step fails without `allow`, then passes with `allow: () => true`.
- `act` can return `ok: true` while a change callback cancelled a value. Check `result.values` or the DOM, not only `ok`.

Also look at the snapshot once by hand (`console.log(JSON.stringify(agent.snapshot(), null, 2))`): every entry should have a label a person would recognize, the actions you expect, and no `"actions": []` on a custom primitive that should do something.
