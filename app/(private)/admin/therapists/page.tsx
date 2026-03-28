import { TherapistTable } from "@/components/therapist-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Download } from "lucide-react"
import { mockTherapists } from "@/lib/mock-data"

export default function TherapistsPage() {
  return (
      <div className="space-y-6 bg-background text-foreground">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Therapists</p>
              <p className="text-2xl font-bold">{mockTherapists.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Verified</p>
              <p className="text-2xl font-bold">
                {mockTherapists.filter((t) => t.verificationStatus === "Verified").length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold text-primary">
                {mockTherapists.filter((t) => t.verificationStatus === "Pending").length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Avg. Rating</p>
              <p className="text-2xl font-bold">
                {(
                  mockTherapists.filter((t) => t.rating > 0).reduce((acc, t) => acc + t.rating, 0) /
                  mockTherapists.filter((t) => t.rating > 0).length
                ).toFixed(1)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search therapists..." className="pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
              <Button className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Therapist
            </Button>
          </div>
        </div>

        {/* Therapist Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>All Therapists</CardTitle>
          </CardHeader>
          <CardContent>
            <TherapistTable therapists={mockTherapists} />
          </CardContent>
        </Card>
      </div>
  )
}
