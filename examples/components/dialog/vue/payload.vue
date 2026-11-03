<script setup lang="ts">
import {
  createDialogController,
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/vue/dialog"
import { ref } from "vue"

type Invoice = { id: string; customer: string; amount: string; status: "Paid" | "Due" }

const invoices: Invoice[] = [
  { id: "INV-001", customer: "Acme", amount: "$250.00", status: "Paid" },
  { id: "INV-002", customer: "Globex", amount: "$150.00", status: "Due" },
  { id: "INV-003", customer: "Initech", amount: "$350.00", status: "Due" },
]

const reminder = createDialogController<Invoice, "send">()
const InvoiceDialogContent = DialogContent<Invoice>
const status = ref("")

async function remindFromCode() {
  const { reason, returnValue } = await reminder.open({ payload: invoices[2] })
  status.value = returnValue === "send" ? "Reminder sent from code" : `Closed with ${reason}`
}

function onOpenChange(open: boolean, details: { returnValue?: string }) {
  if (!open && details.returnValue === "send") status.value = "Reminder sent"
}
</script>

<template>
  <ul data-slot="list">
    <li data-slot="row" v-for="invoice in invoices" :key="invoice.id">
      {{ invoice.customer }}
      <span data-slot="hint">{{ invoice.amount }} · {{ invoice.status }}</span>
      <DialogTrigger
        :controller="reminder"
        :payload="invoice"
        :disabled="invoice.status === 'Paid'"
        :aria-label="`Remind ${invoice.customer}`"
      >
        Remind
      </DialogTrigger>
    </li>
  </ul>
  <button type="button" @click="remindFromCode">Open from code</button>
  <Dialog :controller="reminder" @open-change="onOpenChange">
    <DialogBackdrop />
    <InvoiceDialogContent v-slot="{ state }">
      <div data-slot="stack">
        <DialogTitle>Remind {{ state.payload?.customer }}</DialogTitle>
        <DialogDescription>
          {{ state.payload?.id }} for {{ state.payload?.amount }} is due. We'll email the billing contact.
        </DialogDescription>
      </div>
      <div data-slot="row">
        <DialogClose>Cancel</DialogClose>
        <DialogClose data-variant="solid" value="send">Send reminder</DialogClose>
      </div>
    </InvoiceDialogContent>
  </Dialog>
  <output data-slot="output">{{ status }}</output>
</template>
