"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type PriceHistoryProps = {
  listingId: string
  currentPrice: number
}

type PriceChange = {
  date: string
  price: number
}

export function PriceHistory({ listingId, currentPrice }: PriceHistoryProps) {
  const [priceHistory, setPriceHistory] = useState<PriceChange[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real application, you would fetch the price history from a table
    // For this demo, we'll create some mock data
    const mockPriceHistory = [
      { date: "2023-01-01", price: currentPrice * 0.9 },
      { date: "2023-02-01", price: currentPrice * 0.95 },
      { date: "2023-03-01", price: currentPrice * 1.05 },
      { date: "2023-04-01", price: currentPrice * 1.02 },
      { date: "2023-05-01", price: currentPrice * 0.98 },
      { date: "2023-06-01", price: currentPrice },
    ]

    setPriceHistory(mockPriceHistory)
    setLoading(false)
  }, [currentPrice, listingId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <p>Loading price history...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={priceHistory}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: "short" })}
              />
              <YAxis domain={[(dataMin: number) => dataMin * 0.8, (dataMax: number) => dataMax * 1.2]} />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Line type="monotone" dataKey="price" stroke="#16a34a" activeDot={{ r: 8 }} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
