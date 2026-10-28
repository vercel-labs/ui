// What the rest of core may import from platform's files. import-layers checks every
// import from another folder against this list. Nothing imports this file, so bundles
// don't pay for it.
export { announce, prepareAnnouncements, setAnnouncer } from "./announce"
export {
  buttonAttrs,
  buttonElement,
  type ButtonElement,
  buttonKeydown,
  buttonKeyup,
  opensElsewhere,
} from "./button"
export { isBrowser, isIOS, isRTL } from "./env"
export { measureViewportEarly, trackKeyboard } from "./keyboard"
export {
  activeLayers,
  bindPersistentLayer,
  findLayer,
  inPersistentLayer,
  lastClosed,
  lastEscape,
  type Layer,
  layerContains,
  layerCount,
  markClosed,
  openedSince,
  persistentLayers,
  pushLayer,
} from "./layers"
export { layoutBox, layoutOrigin, layoutSize } from "./layout"
export {
  activeElement,
  ariaKeyshortcuts,
  composedClosest,
  composedContains,
  formatShortcut,
  hasCommandModifier,
  initialApple,
  isApple,
  matchesShortcut,
  prefersReducedMotion,
  supportsTopLayer,
} from "./platform"
export { type Anchor, type PortalProps, position, type PositionOptions, type PositionProps } from "./position"
export { pressedScrollbar } from "./scrollbar"
export { physicalSide, type PhysicalSide, type Side } from "./sides"
export { enforceHidden, registerUninherited, setStyle } from "./style"
