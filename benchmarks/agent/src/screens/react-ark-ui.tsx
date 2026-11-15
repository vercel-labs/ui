import { Accordion } from "@ark-ui/react/accordion"
import { Dialog } from "@ark-ui/react/dialog"
import { Field } from "@ark-ui/react/field"
import { Menu } from "@ark-ui/react/menu"
import { Portal } from "@ark-ui/react/portal"
import { createListCollection, Select } from "@ark-ui/react/select"
import { Switch } from "@ark-ui/react/switch"
import { Tabs } from "@ark-ui/react/tabs"
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

const visibilityCollection = createListCollection({ items: visibilities })

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
          <Tabs.Trigger value="general">General</Tabs.Trigger>
          <Tabs.Trigger value="members">Members</Tabs.Trigger>
          <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="general" className="screen">
          <Field.Root className="field">
            <Field.Label>Project name</Field.Label>
            <Field.Input
              value={settings.name}
              onChange={(event) => update({ name: event.target.value })}
            />
          </Field.Root>
          <Select.Root
            className="field"
            collection={visibilityCollection}
            value={[settings.visibility]}
            onValueChange={(details) =>
              update({ visibility: details.value[0] })
            }
          >
            <Select.Label>Visibility</Select.Label>
            <Select.Control>
              <Select.Trigger className="trigger">
                <Select.ValueText />
              </Select.Trigger>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content className="popup">
                  {visibilityCollection.items.map((item) => (
                    <Select.Item key={item.value} item={item} className="item">
                      <Select.ItemText>{item.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
            <Select.HiddenSelect />
          </Select.Root>
        </Tabs.Content>

        <Tabs.Content value="members">
          <ul className="members">
            {settings.members.map((member) => (
              <li key={member.id} className="row">
                <span className="name">{member.name}</span>
                <span>{member.role === "admin" ? "Admin" : "Member"}</span>
                <Menu.Root
                  onSelect={(details) =>
                    details.value === "remove"
                      ? setRemoving(member)
                      : toggleRole(member.id)
                  }
                >
                  <Menu.Trigger
                    className="button"
                    aria-label={`Actions for ${member.name}`}
                  >
                    ⋯
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content className="popup">
                        <Menu.Item value="role" className="item">
                          {member.role === "admin"
                            ? "Make member"
                            : "Make admin"}
                        </Menu.Item>
                        <Menu.Item value="remove" className="item">
                          Remove
                        </Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              </li>
            ))}
          </ul>
        </Tabs.Content>

        <Tabs.Content value="notifications">
          <Accordion.Root collapsible>
            {channels.map((channel) => (
              <Accordion.Item key={channel.value} value={channel.value}>
                <Accordion.ItemTrigger className="button">
                  {channel.label}
                </Accordion.ItemTrigger>
                <Accordion.ItemContent className="screen">
                  {channel.notifications.map((item) => (
                    <Switch.Root
                      key={item.value}
                      className="choice"
                      checked={settings[channel.value][item.value]}
                      onCheckedChange={(details) =>
                        update({
                          [channel.value]: {
                            ...settings[channel.value],
                            [item.value]: details.checked,
                          },
                        })
                      }
                    >
                      <Switch.Control className="switch">
                        <Switch.Thumb className="switch-thumb" />
                      </Switch.Control>
                      <Switch.Label>{item.label}</Switch.Label>
                      <Switch.HiddenInput />
                    </Switch.Root>
                  ))}
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Tabs.Content>
      </Tabs.Root>

      <Dialog.Root
        role="alertdialog"
        open={removing !== null}
        onOpenChange={(details) => !details.open && setRemoving(null)}
      >
        <Portal>
          <Dialog.Backdrop className="backdrop" />
          <Dialog.Positioner>
            <Dialog.Content className="dialog">
              <Dialog.Title>Remove {removing?.name}?</Dialog.Title>
              <Dialog.Description>
                They lose access to this project right away.
              </Dialog.Description>
              <div className="row">
                <Dialog.CloseTrigger className="button">
                  Cancel
                </Dialog.CloseTrigger>
                <Dialog.CloseTrigger
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
                </Dialog.CloseTrigger>
              </div>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <button type="button" className="button" onClick={() => save(settings)}>
        Save settings
      </button>
    </main>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Screen />)
}

export { mount }
