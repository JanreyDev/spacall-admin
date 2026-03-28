import { MapPin, Users } from "lucide-react"

export function LiveMapPlaceholder() {
  // Mock active sessions for the map
  const activeSessions = [
    { id: 1, lat: 40.7128, lng: -74.006, therapist: "Sarah C." },
    { id: 2, lat: 40.7589, lng: -73.9851, therapist: "Marcus W." },
    { id: 3, lat: 40.6892, lng: -74.0445, therapist: "James P." },
  ]

  return (
    <div className="relative h-[300px] rounded-lg bg-[color:var(--color-secondary)]/50 overflow-hidden font-sans">
      {/* Map Background Pattern */}
      <div className="absolute inset-0 bg-[url('/city-map-grayscale-minimal.jpg')] bg-cover bg-center opacity-30" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-background)]/80 to-transparent" />

      {/* Mock Pins */}
      <div className="absolute inset-0">
        {activeSessions.map((session, index) => (
          <div
            key={session.id}
            className="absolute animate-pulse"
            style={{
              top: `${20 + index * 25}%`,
              left: `${20 + index * 20}%`,
            }}
          >
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-[color:var(--color-primary)]/30 animate-ping" />
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--color-primary)] shadow-lg">
                <MapPin className="h-4 w-4 text-[color:var(--color-primary-foreground)]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center justify-between rounded-lg bg-[color:var(--color-background)]/90 backdrop-blur-sm p-3 border border-[color:var(--color-border)]">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[color:var(--color-primary)]" />
            <span className="text-sm font-medium">Live Sessions</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-primary)] animate-pulse" />
              <span className="text-[color:var(--color-muted-foreground)]">{activeSessions.length} Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
