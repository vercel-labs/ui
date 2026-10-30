# Backlog

Open work, bugs and ideas. Add what you find; delete what lands.

## Bugs

- **Solid keeps an event's target alive.** `@solidjs/web` gives each delegated event its own `currentTarget` getter, and V8 keeps the first one on the shape all events of that type share, so one keydown, click or focus target, and the page around it, stays alive. Any Solid app with a delegated handler has it, and rc.19 doesn't fix it. The fix belongs in Solid: one shared getter that reads the current node from the event. With it, every Solid leak test passes, including the single unmount test in `tests/specs/leaks.spec.ts`, which skips Solid until then. Details in `.agents/experts/solid/decisions.md`.
