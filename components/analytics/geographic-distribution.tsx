"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { mockGeographicData } from "@/lib/mock-data"

export function GeographicDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Distribution</CardTitle>
        <CardDescription>Bookings by area</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 font-sans">
          {mockGeographicData.map((area) => (
            <div key={area.area} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{area.area}</span>
                <span className="text-muted-foreground">
                  {area.bookings} bookings · ${area.revenue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={area.percentage} className="h-2 flex-1" />
                <span className="text-xs text-muted-foreground w-8">{area.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
