import "@ui-sdk/web/menu"
import {
  Check,
  ChevronRight,
  CircleHelp,
  createElement,
  Keyboard,
  Link,
  LogOut,
  Mail,
  MessageCircle,
  Monitor,
  Moon,
  Plus,
  Settings,
  Sun,
  User,
  UserPlus,
  Users,
} from "lucide"

function mount(root: HTMLElement) {
  let action = ""
  let sidebar = true
  let theme = "system"

  root.innerHTML = `
    <div data-slot="stack">
      <ui-menu>
        <ui-menu-trigger>
          <button>Workspace</button>
        </ui-menu-trigger>
        <ui-menu-content>
          <ui-menu-group>
            <ui-menu-group-label>My account</ui-menu-group-label>
            <ui-menu-item value="profile" shortcut="mod+shift+p">
              ${createElement(User, { "aria-hidden": "true" }).outerHTML}
              Profile
            </ui-menu-item>
            <ui-menu-item value="settings" shortcut="mod+,">
              ${createElement(Settings, { "aria-hidden": "true" }).outerHTML}
              Settings
            </ui-menu-item>
            <ui-menu-item value="shortcuts" shortcut="mod+k">
              ${createElement(Keyboard, { "aria-hidden": "true" }).outerHTML}
              Keyboard shortcuts
            </ui-menu-item>
          </ui-menu-group>
          <ui-menu-separator></ui-menu-separator>
          <ui-menu-group>
            <ui-menu-item value="team">
              ${createElement(Users, { "aria-hidden": "true" }).outerHTML}
              Team
            </ui-menu-item>
            <ui-menu-sub>
              <ui-menu-sub-trigger>
                ${createElement(UserPlus, { "aria-hidden": "true" }).outerHTML}
                Invite people
                ${createElement(ChevronRight, { "aria-hidden": "true" }).outerHTML}
              </ui-menu-sub-trigger>
              <ui-menu-sub-content>
                <ui-menu-item value="invite-email">
                  ${createElement(Mail, { "aria-hidden": "true" }).outerHTML}
                  Email
                </ui-menu-item>
                <ui-menu-item value="invite-message">
                  ${createElement(MessageCircle, { "aria-hidden": "true" }).outerHTML}
                  Message
                </ui-menu-item>
                <ui-menu-separator></ui-menu-separator>
                <ui-menu-item value="invite-link">
                  ${createElement(Link, { "aria-hidden": "true" }).outerHTML}
                  Copy invite link
                </ui-menu-item>
              </ui-menu-sub-content>
            </ui-menu-sub>
            <ui-menu-item value="new-team" shortcut="mod+t">
              ${createElement(Plus, { "aria-hidden": "true" }).outerHTML}
              New team
            </ui-menu-item>
          </ui-menu-group>
          <ui-menu-separator></ui-menu-separator>
          <ui-menu-checkbox-item value="sidebar" checked="true">
            ${createElement(Monitor, { "aria-hidden": "true" }).outerHTML}
            Show sidebar
            ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
          </ui-menu-checkbox-item>
          <ui-menu-sub>
            <ui-menu-sub-trigger>
              <span data-theme-icon>${createElement(Sun, { "aria-hidden": "true" }).outerHTML}</span>
              Theme
              ${createElement(ChevronRight, { "aria-hidden": "true" }).outerHTML}
            </ui-menu-sub-trigger>
            <ui-menu-sub-content>
              <ui-menu-radio-group value="system">
                <ui-menu-radio-item value="light">
                  ${createElement(Sun, { "aria-hidden": "true" }).outerHTML}
                  Light
                  ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
                </ui-menu-radio-item>
                <ui-menu-radio-item value="dark">
                  ${createElement(Moon, { "aria-hidden": "true" }).outerHTML}
                  Dark
                  ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
                </ui-menu-radio-item>
                <ui-menu-radio-item value="system">
                  ${createElement(Monitor, { "aria-hidden": "true" }).outerHTML}
                  System
                  ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
                </ui-menu-radio-item>
              </ui-menu-radio-group>
            </ui-menu-sub-content>
          </ui-menu-sub>
          <ui-menu-separator></ui-menu-separator>
          <ui-menu-item value="help">
            ${createElement(CircleHelp, { "aria-hidden": "true" }).outerHTML}
            Help
          </ui-menu-item>
          <ui-menu-item value="sign-out" shortcut="mod+shift+q">
            ${createElement(LogOut, { "aria-hidden": "true" }).outerHTML}
            Sign out
          </ui-menu-item>
        </ui-menu-content>
      </ui-menu>
      <output data-slot="output">Sidebar shown, system theme</output>
    </div>
  `
  const show = () => {
    root.querySelector("output")!.textContent = action
      ? `Ran ${action}`
      : `Sidebar ${sidebar ? "shown" : "hidden"}, ${theme} theme`
  }

  root.addEventListener(
    "action",
    (event) => {
      action = (event as CustomEvent<{ value: string }>).detail.value
      show()
    },
    { capture: true },
  )
  root.addEventListener(
    "checkedchange",
    (event) => {
      sidebar = (event as CustomEvent<{ value: boolean }>).detail.value
      ;(event.target as HTMLElement).setAttribute("checked", String(sidebar))
      show()
    },
    { capture: true },
  )
  root.addEventListener(
    "valuechange",
    (event) => {
      theme = (event as CustomEvent<{ value: string }>).detail.value
      ;(event.target as HTMLElement).setAttribute("value", theme)
      root
        .querySelector("[data-theme-icon]")!
        .replaceChildren(createElement(theme === "dark" ? Moon : Sun, { "aria-hidden": "true" }))
      show()
    },
    { capture: true },
  )
}

export { mount }
