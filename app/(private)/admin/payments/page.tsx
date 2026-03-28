import { PayoutList } from "@/components/payout-list"
import { DisputePanel } from "@/components/dispute-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, CreditCard, AlertCircle, TrendingUp } from "lucide-react"
import { mockPayouts, mockDisputes } from "@/lib/mock-data"

export default function PaymentsPage() {
  const pendingPayouts = mockPayouts.filter((p) => p.status === "Pending")
  const totalPending = pendingPayouts.reduce((acc, p) => acc + p.amount, 0)

  return (
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-[color:var(--color-primary)] bg-[color:var(--color-sidebar)] text-[color:var(--color-sidebar-foreground)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[color:var(--color-primary)] p-2">
                  <DollarSign className="h-5 w-5 text-[color:var(--color-primary-foreground)]" />
                </div>
                <div>
                  <p className="text-sm text-[color:var(--color-muted-foreground)]">Pending Payouts</p>
                  <p className="text-2xl font-bold text-[color:var(--color-primary)]">${totalPending.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[color:var(--color-border)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[color:var(--color-secondary)] p-2">
                  <CreditCard className="h-5 w-5 text-[color:var(--color-secondary-foreground)]" />
                </div>
                <div>
                  <p className="text-sm text-[color:var(--color-muted-foreground)]">Processing</p>
                  <p className="text-2xl font-bold">{mockPayouts.filter((p) => p.status === "Processing").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[color:var(--color-border)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[color:var(--color-secondary)] p-2">
                  <AlertCircle className="h-5 w-5 text-[color:var(--color-secondary-foreground)]" />
                </div>
                <div>
                  <p className="text-sm text-[color:var(--color-muted-foreground)]">Open Disputes</p>
                  <p className="text-2xl font-bold">{mockDisputes.filter((d) => d.status !== "Resolved").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[color:var(--color-border)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-secondary p-2">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">$125,680</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="payouts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="payouts">Pending Payouts</TabsTrigger>
            <TabsTrigger value="disputes">Dispute Cases</TabsTrigger>
          </TabsList>

          <TabsContent value="payouts">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Payout Requests</CardTitle>
                <p className="text-sm text-muted-foreground">Review and approve therapist payout requests</p>
              </CardHeader>
              <CardContent>
                <PayoutList payouts={mockPayouts} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disputes" className="space-y-4">
            {mockDisputes.map((dispute) => (
              <DisputePanel key={dispute.id} dispute={dispute} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
  )
}
