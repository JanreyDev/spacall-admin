"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockServicePopularity } from "@/lib/mock-data"

export function ServicePopularityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Popularity</CardTitle>
        <CardDescription>Most booked massage types</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockServicePopularity} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
              <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))" }} className="text-xs" />
              <YAxis
                dataKey="service"
                type="category"
                width={90}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                className="text-xs"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-lg">
                        <p className="text-sm font-medium">{payload[0].payload.service}</p>
                        <p className="text-lg font-bold">{payload[0].payload.bookings} bookings</p>
                        <p className="text-sm text-sidebar-primary">${payload[0].payload.revenue.toLocaleString()} revenue</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="bookings" fill="#b8860b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
