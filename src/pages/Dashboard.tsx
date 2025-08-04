import { StatsCard } from "@/components/dashboard/StatsCard";
import { SubscriptionCard, Subscription } from "@/components/subscriptions/SubscriptionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, DollarSign, TrendingUp, Calendar, AlertCircle } from "lucide-react";

const mockSubscriptions: Subscription[] = [
  {
    id: "1",
    name: "Netflix",
    category: "entertainment",
    cost: 15.99,
    billingCycle: "monthly",
    nextBilling: "2024-08-15",
    status: "active",
    description: "Premium streaming service"
  },
  {
    id: "2",
    name: "Spotify",
    category: "entertainment",
    cost: 9.99,
    billingCycle: "monthly",
    nextBilling: "2024-08-12",
    status: "active",
    description: "Music streaming"
  },
  {
    id: "3",
    name: "Adobe Creative Suite",
    category: "productivity",
    cost: 52.99,
    billingCycle: "monthly",
    nextBilling: "2024-08-20",
    status: "active",
    description: "Design and creativity tools"
  },
  {
    id: "4",
    name: "ChatGPT Plus",
    category: "productivity",
    cost: 20.00,
    billingCycle: "monthly",
    nextBilling: "2024-08-08",
    status: "trial",
    description: "AI assistant"
  }
];

interface DashboardProps {
  onAddSubscription: () => void;
}

export const Dashboard = ({ onAddSubscription }: DashboardProps) => {
  const totalMonthly = mockSubscriptions
    .filter(sub => sub.status === "active")
    .reduce((sum, sub) => {
      const monthlyCost = sub.billingCycle === "yearly" ? sub.cost / 12 : 
                         sub.billingCycle === "quarterly" ? sub.cost / 3 : sub.cost;
      return sum + monthlyCost;
    }, 0);

  const upcomingRenewals = mockSubscriptions.filter(sub => {
    const now = new Date();
    const billing = new Date(sub.nextBilling);
    const diffTime = billing.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  });

  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      {/* Header */}
      <div className="bg-gradient-primary p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">SubWise</h1>
            <p className="text-primary-foreground/80">Smart subscription management</p>
          </div>
          <Button 
            onClick={onAddSubscription}
            className="bg-white text-primary hover:bg-white/90 shadow-button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Subscription
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-sm mb-1">
              <DollarSign className="h-4 w-4" />
              Monthly Total
            </div>
            <div className="text-2xl font-bold">${totalMonthly.toFixed(2)}</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-sm mb-1">
              <Calendar className="h-4 w-4" />
              Active Subscriptions
            </div>
            <div className="text-2xl font-bold">{mockSubscriptions.filter(s => s.status === "active").length}</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="This Month"
            value={`$${totalMonthly.toFixed(2)}`}
            change={-12}
            trend="down"
            icon={<DollarSign className="h-6 w-6 text-primary" />}
          />
          <StatsCard
            title="Projected Annual"
            value={`$${(totalMonthly * 12).toFixed(0)}`}
            change={5}
            trend="up"
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
          />
          <StatsCard
            title="Active Subscriptions"
            value={mockSubscriptions.filter(s => s.status === "active").length.toString()}
            icon={<Calendar className="h-6 w-6 text-primary" />}
          />
        </div>

        {/* Upcoming Renewals */}
        {upcomingRenewals.length > 0 && (
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              <CardTitle className="text-lg">Upcoming Renewals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingRenewals.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Recent Subscriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockSubscriptions.slice(0, 3).map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};