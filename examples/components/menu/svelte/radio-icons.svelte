<script lang="ts">
  import { CheckIcon, CreditCardIcon, LandmarkIcon, WalletIcon } from "@lucide/svelte"
  import {
    Menu,
    MenuContent,
    MenuGroupLabel,
    MenuRadioGroup,
    MenuRadioItem,
    MenuTrigger,
  } from "@ui-sdk/svelte/menu"

  const methods = [
    { value: "card", label: "Credit card", icon: CreditCardIcon },
    { value: "wallet", label: "Wallet", icon: WalletIcon },
    { value: "bank", label: "Bank transfer", icon: LandmarkIcon, disabled: true },
  ]

  let method = $state("card")
  const current = $derived(methods.find((option) => option.value === method)!)
</script>

<div data-slot="stack">
  <Menu>
    <MenuTrigger>
      <current.icon />
      Payment method
    </MenuTrigger>
    <MenuContent>
      <MenuRadioGroup bind:value={method}>
        <MenuGroupLabel>Pay with</MenuGroupLabel>
        {#each methods as option (option.value)}
          <MenuRadioItem value={option.value} disabled={option.disabled}>
            <option.icon />
            {option.label}
            <CheckIcon />
          </MenuRadioItem>
        {/each}
      </MenuRadioGroup>
    </MenuContent>
  </Menu>
  <output data-slot="output">Paying with {current.label.toLowerCase()}</output>
</div>
