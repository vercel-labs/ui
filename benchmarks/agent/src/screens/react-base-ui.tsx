import { Accordion } from "@base-ui/react/accordion"
import { AlertDialog } from "@base-ui/react/alert-dialog"
import { Button } from "@base-ui/react/button"
import { Field } from "@base-ui/react/field"
import { Menu } from "@base-ui/react/menu"
import { Select } from "@base-ui/react/select"
import { Switch } from "@base-ui/react/switch"
import { Tabs } from "@base-ui/react/tabs"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  channels,
  initialSettings,
  type Member,
  save,
  type Settings,
  visibilities,
} from "../settings"

function Screen() {
  const [settings, setSettings] = React.useState(initialSettings)
  const [removing, setRemoving] = React.useState<Member | null>(null)
  const update = (patch: Partial<Settings>) =>
    setSettings((current) => ({ ...current, ...patch }))
  const toggleRole = (id: string) =>
    update({
      members: settings.members.map((member) =>
        member.id === id
          ? { ...member, role: member.role === "admin" ? "member" : "admin" }
          : member
      ),
    })

  return (
    <main className="screen">
      <h1>Project settings</h1>
      <Tabs.Root defaultValue="general">
        <Tabs.List className="row" aria-label="Settings">
          <Tabs.Tab value="general">General</Tabs.Tab>
          <Tabs.Tab value="members">Members</Tabs.Tab>
          <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general" className="screen">
          <Field.Root className="field">
            <Field.Label>Project name</Field.Label>
            <Field.Control
              value={settings.name}
              onValueChange={(name) => update({ name })}
            />
          </Field.Root>
          <Select.Root
            items={visibilities}
            value={settings.visibility}
            onValueChange={(value) => update({ visibility: value as string })}
          >
            <div className="field">
              <Select.Label>Visibility</Select.Label>
              <Select.Trigger className="trigger">
                <Select.Value />
              </Select.Trigger>
            </div>
            <Select.Portal>
              <Select.Positioner sideOffset={4} alignItemWithTrigger={false}>
                <Select.Popup className="popup">
                  {visibilities.map((item) => (
                    <Select.Item
                      key={item.value}
                      value={item.value}
                      className="item"
                    >
                      <Select.ItemText>{item.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
        </Tabs.Panel>

        <Tabs.Panel value="members">
          <ul className="members">
            {settings.members.map((member) => (
              <li key={member.id} className="row">
                <span className="name">{member.name}</span>
                <span>{member.role === "admin" ? "Admin" : "Member"}</span>
                <Menu.Root>
                  <Menu.Trigger
                    className="button"
                    aria-label={`Actions for ${member.name}`}
                  >
                    ⋯
                  </Menu.Trigger>
                  <Menu.Portal>
                    <Menu.Positioner sideOffset={4}>
                      <Menu.Popup className="popup">
                        <Menu.Item
                          className="item"
                          onClick={() => toggleRole(member.id)}
                        >
                          {member.role === "admin"
                            ? "Make member"
                            : "Make admin"}
                        </Menu.Item>
                        <Menu.Item
                          className="item"
                          onClick={() => setRemoving(member)}
                        >
                          Remove
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.Root>
              </li>
            ))}
          </ul>
        </Tabs.Panel>

        <Tabs.Panel value="notifications">
          <Accordion.Root>
            {channels.map((channel) => (
              <Accordion.Item key={channel.value} value={channel.value}>
                <Accordion.Header>
                  <Accordion.Trigger className="button">
                    {channel.label}
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Panel className="screen">
                  {channel.notifications.map((item) => (
                    <label key={item.value} className="choice">
                      <Switch.Root
                        className="switch"
                        checked={settings[channel.value][item.value]}
                        onCheckedChange={(on) =>
                          update({
                            [channel.value]: {
                              ...settings[channel.value],
                              [item.value]: on,
                            },
                          })
                        }
                      >
                        <Switch.Thumb className="switch-thumb" />
                      </Switch.Root>
                      {item.label}
                    </label>
                  ))}
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Tabs.Panel>
      </Tabs.Root>

      <AlertDialog.Root
        open={removing !== null}
        onOpenChange={(open) => !open && setRemoving(null)}
      >
        <AlertDialog.Portal>
          <AlertDialog.Backdrop className="backdrop" />
          <AlertDialog.Popup className="dialog">
            <AlertDialog.Title>Remove {removing?.name}?</AlertDialog.Title>
            <AlertDialog.Description>
              They lose access to this project right away.
            </AlertDialog.Description>
            <div className="row">
              <AlertDialog.Close className="button">Cancel</AlertDialog.Close>
              <AlertDialog.Close
                className="button"
                onClick={() =>
                  update({
                    members: settings.members.filter(
                      (member) => member.id !== removing?.id
                    ),
                  })
                }
              >
                Remove
              </AlertDialog.Close>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>

      <Button className="button" onClick={() => save(settings)}>
        Save settings
      </Button>
    </main>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Screen />)
}

export { mount }
