import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SubscriptionCard, Subscription } from "@/components/subscriptions/SubscriptionCard";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  DollarSign, 
  AlertCircle
} from "lucide-react";

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
  onAddSubscription?: () => void;
}

export const Dashboard = ({ onAddSubscription }: DashboardProps = {}) => {
  const navigate = useNavigate();
  const { 
    subscriptions, 
    loading,
    getTotalMonthlySpending, 
    getUpcomingRenewals,
    updateSubscription,
    deleteSubscription
  } = useSubscriptions();

  if (loading) {
    return <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>;
  }

  const monthlySpending = getTotalMonthlySpending();
  const upcomingRenewals = getUpcomingRenewals(7);
  const activeCount = subscriptions.filter(s => s.status === 'active').length;

  const handleEditSubscription = (subscription: any) => {
    navigate('/add-subscription', { state: { editingSubscription: subscription } });
  };

  const handleCancelSubscription = (subscription: any) => {
    if (confirm(`Are you sure you want to cancel ${subscription.name}?`)) {
      updateSubscription(subscription.id, { status: 'cancelled' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      {/* Header */}
      <div className="bg-gradient-primary p-6 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">SubWise</h1>
              <p className="text-primary-foreground/80 mt-1">Smart subscription management</p>
            </div>
            <Button 
              onClick={() => navigate('/add-subscription')}
              className="btn-premium hover-scale shadow-button"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Subscription
            </Button>
          </div>

          {/* Quick Stats with Enhanced Design */}
          <div className="grid grid-cols-2 gap-4 stagger-children">
            <div className="glass-card p-4 rounded-xl animate-scale-in">
              <div className="flex items-center gap-2 text-primary-foreground/80 text-sm mb-2">
                <DollarSign className="h-4 w-4" />
                Monthly Total
              </div>
              <div className="text-2xl font-bold">${monthlySpending.toFixed(2)}</div>
              <div className="text-sm text-primary-foreground/60 mt-1">This month</div>
            </div>
            <div className="glass-card p-4 rounded-xl animate-scale-in">
              <div className="flex items-center gap-2 text-primary-foreground/80 text-sm mb-2">
                <CalendarIcon className="h-4 w-4" />
                Active Subscriptions
              </div>
              <div className="text-2xl font-bold">{activeCount}</div>
              <div className="text-sm text-primary-foreground/60 mt-1">Currently active</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 stagger-children">
        {/* Overview Stats with Enhanced Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <StatsCard
              title="This Month"
              value={`$${monthlySpending.toFixed(2)}`}
              icon={<DollarSign className="h-6 w-6 text-primary" />}
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <StatsCard
              title="Projected Annual"
              value={`$${(monthlySpending * 12).toFixed(0)}`}
              icon={<TrendingUp className="h-6 w-6 text-primary" />}
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <StatsCard
              title="Active Subscriptions"
              value={activeCount.toString()}
              icon={<CalendarIcon className="h-6 w-6 text-primary" />}
            />
          </div>
        </div>

        {/* Upcoming Renewals with Pulse Effect */}
        {upcomingRenewals.length > 0 && (
          <Card className="card-enhanced animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="flex flex-row items-center gap-2">
              <div className="p-2 bg-warning/10 rounded-lg">
                <AlertCircle className="h-5 w-5 text-warning animate-pulse" />
              </div>
              <CardTitle className="text-lg">Upcoming Renewals</CardTitle>
              <div className="ml-auto">
                <div className="px-3 py-1 bg-warning/20 text-warning text-sm rounded-full">
                  {upcomingRenewals.length} this week
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingRenewals.map((subscription, index) => (
                <div key={subscription.id} className="animate-slide-up" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                  <SubscriptionCard
                    subscription={subscription}
                    onEdit={handleEditSubscription}
                    onCancel={handleCancelSubscription}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Recent Activity with Enhanced Layout */}
        <Card className="card-enhanced animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              Recent Subscriptions
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscriptions.slice(0, 3).map((subscription, index) => (
              <div key={subscription.id} className="animate-slide-up" style={{ animationDelay: `${0.7 + index * 0.1}s` }}>
                <SubscriptionCard
                  subscription={subscription}
                  onEdit={handleEditSubscription}
                  onCancel={handleCancelSubscription}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions Section */}
        <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <Card 
            className="card-enhanced hover-scale cursor-pointer group"
            onClick={() => navigate('/add-subscription')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:animate-bounce-in">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-1">Add Subscription</h3>
              <p className="text-sm text-muted-foreground">Track a new service</p>
            </CardContent>
          </Card>
          
          <Card 
            className="card-enhanced hover-scale cursor-pointer group"
            onClick={() => navigate('/analytics')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-success rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:animate-bounce-in">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-1">View Analytics</h3>
              <p className="text-sm text-muted-foreground">See spending insights</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
