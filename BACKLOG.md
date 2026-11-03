# Backlog

Open work, bugs and ideas. Add what you find; delete what lands.

- **React token input renders a custom token's label twice.** In `examples/token-input/react/deletion.tsx`, `renderToken` returns `<TokenInputToken>@{token.label}</TokenInputToken>`, and the host keeps the default label next to it, so the editor reads "routes.ts@routes.ts". Web and Svelte render it once.
- **A press on a control under a closing popup is lost.** In the core Popups page's options example, the cart popup overlaps the checkbox row while it fades out. A click on the Modal checkbox during that exit doesn't toggle it, even with `pointer-events: none` on `[data-ending-style]`: a capture listener prevents the `pointerdown`, so no click fires. Once the exit ends it works. The spec waits for the popup to hide; decide whether core should still block presses over a popup that is already closing.
