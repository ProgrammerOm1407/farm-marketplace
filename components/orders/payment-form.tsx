"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/format"

interface PaymentFormProps {
  orderId: string
  remainingBalance: number
}

export function PaymentForm({ orderId, remainingBalance }: PaymentFormProps) {
  const router = useRouter()
  const [amount, setAmount] = useState(remainingBalance.toString())
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer")
  const [reference, setReference] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/orders/record-payment?id=${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          payment_method: paymentMethod,
          transaction_reference: reference,
          notes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to record payment")
      }

      setShowForm(false)
      router.refresh()
    } catch (error) {
      console.error("Error recording payment:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!showForm) {
    return (
      <Button variant="outline" className="w-full mt-2" onClick={() => setShowForm(true)}>
        Record Payment
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md mt-2">
      <h4 className="font-medium">Record Payment</h4>
      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">
          Amount
        </label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          max={remainingBalance}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <p className="text-xs text-gray-500">Remaining balance: {formatCurrency(remainingBalance)}</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="payment-method" className="text-sm font-medium">
          Payment Method
        </label>
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger id="payment-method">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="credit_card">Credit Card</SelectItem>
            <SelectItem value="cash_on_delivery">Cash on Delivery</SelectItem>
            <SelectItem value="check">Check</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label htmlFor="reference" className="text-sm font-medium">
          Transaction Reference (Optional)
        </label>
        <Input
          id="reference"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="e.g., Transaction ID, Check Number"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes (Optional)
        </label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional information about this payment"
          rows={2}
        />
      </div>
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
          Cancel
        </Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Record Payment
        </Button>
      </div>
    </form>
  )
}
