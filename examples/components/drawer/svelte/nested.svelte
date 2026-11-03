<script lang="ts">
  import {
    Drawer,
    DrawerBackdrop,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
    DrawerTrigger,
  } from "@ui-sdk/svelte/drawer"
</script>

<Drawer>
  <DrawerTrigger>
    Account
  </DrawerTrigger>
  <DrawerBackdrop />
  <DrawerContent>
    <div data-slot="grip" aria-hidden="true"></div>
    <div data-slot="stack">
      <DrawerTitle>Account</DrawerTitle>
      <DrawerDescription>Manage how you sign in.</DrawerDescription>
    </div>
    <dl>
      <div data-slot="row">
        <dt>Email</dt>
        <dd>ada@example.com</dd>
      </div>
      <div data-slot="row">
        <dt>Password</dt>
        <dd>Changed 3 months ago</dd>
      </div>
      <div data-slot="row">
        <dt>Two-factor</dt>
        <dd>On</dd>
      </div>
    </dl>
    <div data-slot="stack">
      <Drawer>
        <DrawerTrigger>
          Change password
        </DrawerTrigger>
        <DrawerBackdrop />
        <DrawerContent>
          <div data-slot="grip" aria-hidden="true"></div>
          <div data-slot="stack">
            <DrawerTitle>Change password</DrawerTitle>
            <DrawerDescription>Use at least 12 characters.</DrawerDescription>
          </div>
          <label data-slot="label">
            New password
            <input type="password" />
          </label>
          <div data-slot="stack">
            <DrawerClose data-variant="solid">
              Update
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
      <DrawerClose data-variant="solid">
        Done
      </DrawerClose>
    </div>
  </DrawerContent>
</Drawer>
