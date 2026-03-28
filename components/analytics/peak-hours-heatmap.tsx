"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockPeakHours } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const timeSlots = ["6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"]

function getIntensityColor(value: number, max: number) {
  const intensity = value / max
  if (intensity > 0.8) return "bg-sidebar-primary"
  if (intensity > 0.6) return "bg-sidebar-primary/80"
  if (intensity > 0.4) return "bg-sidebar-primary/60"
  if (intensity > 0.2) return "bg-sidebar-primary/40"
  return "bg-sidebar-primary/20"
}

export function PeakHoursHeatmap() {
  const maxValue = Math.max(...mockPeakHours.flatMap((d) => d.hours))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Peak Booking Hours</CardTitle>
        <CardDescription>Busiest times throughout the week</CardDescription>
      </CardHeader>
      <CardContent>
      <div className="space-y-2 font-sans">
          {/* Time labels */}
          <div className="flex items-center gap-1">
            <div className="w-10" />
            {timeSlots.map((time) => (
              <div key={time} className="flex-1 text-center text-xs text-muted-foreground">
                {time}
              </div>
            ))}
          </div>
          {/* Heatmap grid */}
          {mockPeakHours.map((dayData) => (
            <div key={dayData.day} className="flex items-center gap-1">
              <div className="w-10 text-xs font-medium">{dayData.day}</div>
              {dayData.hours.slice(0, 9).map((value, i) => (
                <div
                  key={i}
                  className={cn("flex-1 h-8 rounded-sm", getIntensityColor(value, maxValue))}
                  title={`${value} bookings`}
                />
              ))}
            </div>
          ))}
          {/* Legend */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex items-center gap-1">
              {["bg-sidebar-primary/20", "bg-sidebar-primary/40", "bg-sidebar-primary/60", "bg-sidebar-primary/80", "bg-sidebar-primary"].map(
                (cls, i) => (
                  <div key={i} className={cn("h-3 w-3 rounded-sm", cls)} />
                ),
              )}
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
