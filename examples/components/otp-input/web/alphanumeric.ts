import "@ui-sdk/web/otp-input"
import { createElement, Minus } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-otp-input max-length="8" pattern="alphanumeric" aria-label="Recovery code">
      <ui-otp-input-group>
        <ui-otp-input-slot></ui-otp-input-slot>
        <ui-otp-input-slot></ui-otp-input-slot>
        <ui-otp-input-slot></ui-otp-input-slot>
        <ui-otp-input-slot></ui-otp-input-slot>
      </ui-otp-input-group>
      <ui-otp-input-separator>${createElement(Minus, { "aria-hidden": "true" }).outerHTML}</ui-otp-input-separator>
      <ui-otp-input-group>
        <ui-otp-input-slot></ui-otp-input-slot>
        <ui-otp-input-slot></ui-otp-input-slot>
        <ui-otp-input-slot></ui-otp-input-slot>
        <ui-otp-input-slot></ui-otp-input-slot>
      </ui-otp-input-group>
    </ui-otp-input>
  `
}
