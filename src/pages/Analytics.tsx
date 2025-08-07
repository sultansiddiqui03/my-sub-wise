import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  Calendar,
  AlertTriangle,
  Target,
  Zap
} from "lucide-react";

const mockAnalytics = {
  monthlySpending: [
    { month: "Jan", amount: 120.50 },
    { month: "Feb", amount: 98.97 },
    { month: "Mar", amount: 132.45 },
    { month: "Apr", amount: 145.32 },
    { month: "May", amount: 128.88 },
    { month: "Jun", amount: 156.74 },
    { month: "Jul", amount: 142.21 },
    { month: "Aug", amount: 159.65 }
  ],
  categoryBreakdown: [
    { category: "Entertainment", amount: 42.97, percentage: 27, color: "category-entertainment" },
    { category: "Productivity", amount: 72.99, percentage: 46, color: "category-productivity" },
    { category: "Utilities", amount: 29.99, percentage: 19, color: "category-utilities" },
    { category: "Health", amount: 13.70, percentage: 8, color: "category-health" }
  ],
  insights: [
    {
      type: "warning",
      title: "Duplicate Services",
      description: "You have multiple streaming services costing $42.97/month",
      action: "Consider consolidating to save ~$20/month"
    },
    {
      type: "success", 
      title: "Annual Savings Opportunity",
      description: "Switching to annual billing could save you $156 this year",
      action: "Review Adobe Creative Suite and Dropbox"
    },
    {
      type: "info",
      title: "Underutilized Subscription",
      description: "Low usage detected on ChatGPT Plus",
      action: "Consider downgrading or pausing"
    }
  ]
};

export const Analytics = () => {
  const { subscriptions, loading, getTotalMonthlySpending, getCategorySpending, getUpcomingRenewals } = useSubscriptions();

  if (loading) {
    return <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>;
  }

  const currentMonthSpending = getTotalMonthlySpending();
  const categorySpending = getCategorySpending();
  const yearlyProjection = currentMonthSpending * 12;
  const upcomingRenewals = getUpcomingRenewals(7);
  
  // Calculate real analytics
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
  const trialSubscriptions = subscriptions.filter(sub => sub.status === 'trial');
  
  // Calculate potential savings from annual billing
  const annualSavingsOpportunity = activeSubscriptions
    .filter(sub => sub.billingCycle === 'monthly')
    .reduce((total, sub) => total + (sub.cost * 12 * 0.15), 0); // Assume 15% savings on annual
  
  // Calculate duplicate/similar services
  const duplicateCategories = Object.entries(categorySpending)
    .filter(([_, amount]) => amount > currentMonthSpending * 0.3)
    .map(([category, amount]) => ({ category, amount }));

  const categoryBreakdown = Object.entries(categorySpending).map(([category, amount]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    amount: amount,
    percentage: Math.round((amount / currentMonthSpending) * 100),
    color: `category-${category}`
  }));

  // Mock month-over-month for demo (in real app, this would come from historical data)
  const monthOverMonthChange = 12.5;

  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      {/* Header */}
      <div className="bg-gradient-primary p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-primary-foreground/80">Financial insights & recommendations</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-sm mb-1">
              <DollarSign className="h-4 w-4" />
              This Month
            </div>
            <div className="text-2xl font-bold">${currentMonthSpending.toFixed(2)}</div>
            <div className="text-sm text-primary-foreground/80">
              {monthOverMonthChange > 0 ? "+" : ""}{monthOverMonthChange.toFixed(1)}% vs last month
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-sm mb-1">
              <Target className="h-4 w-4" />
              Annual Savings
            </div>
            <div className="text-2xl font-bold">${annualSavingsOpportunity.toFixed(0)}</div>
            <div className="text-sm text-primary-foreground/80">Switch to annual billing</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Monthly Average"
            value={`$${currentMonthSpending.toFixed(2)}`}
            change={monthOverMonthChange}
            trend={monthOverMonthChange > 0 ? "up" : "down"}
            icon={<DollarSign className="h-6 w-6 text-primary" />}
          />
          <StatsCard
            title="Yearly Projection"
            value={`$${yearlyProjection.toFixed(0)}`}
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
          />
          <StatsCard
            title="Active Categories"
            value={Object.keys(categorySpending).length.toString()}
            icon={<PieChart className="h-6 w-6 text-primary" />}
          />
        </div>

        {/* Spending Trend */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Spending Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAnalytics.monthlySpending.slice(-6).map((month) => (
                <div key={month.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{month.month}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full"
                        style={{ width: `${(month.amount / 200) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold w-16 text-right">${month.amount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Spending by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryBreakdown.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={`bg-${category.color}/10 text-${category.color}`}>
                        {category.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{category.percentage}%</span>
                    </div>
                    <span className="font-bold">${category.amount.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`bg-gradient-primary h-2 rounded-full`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              {categoryBreakdown.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No subscription data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Smart Insights */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Smart Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Annual Billing Savings */}
            {annualSavingsOpportunity > 50 && (
              <div className="p-4 rounded-lg border bg-success/10 border-success/20">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Annual Billing Savings</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Switch {activeSubscriptions.filter(s => s.billingCycle === 'monthly').length} monthly subscriptions to annual billing
                    </p>
                    <p className="text-sm font-medium text-success">Save ~${annualSavingsOpportunity.toFixed(0)} per year</p>
                  </div>
                </div>
              </div>
            )}

            {/* Trial Subscriptions Warning */}
            {trialSubscriptions.length > 0 && (
              <div className="p-4 rounded-lg border bg-warning/10 border-warning/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Trial Subscriptions</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      You have {trialSubscriptions.length} trial subscription{trialSubscriptions.length > 1 ? 's' : ''} that will auto-renew
                    </p>
                    <p className="text-sm font-medium text-warning">Review before they convert to paid</p>
                  </div>
                </div>
              </div>
            )}

            {/* High Category Spending */}
            {duplicateCategories.length > 0 && (
              <div className="p-4 rounded-lg border bg-primary/10 border-primary/20">
                <div className="flex items-start gap-3">
                  <PieChart className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">High Category Spending</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Your {duplicateCategories[0].category} subscriptions represent {Math.round((duplicateCategories[0].amount / currentMonthSpending) * 100)}% of total spending
                    </p>
                    <p className="text-sm font-medium text-primary">Consider consolidating similar services</p>
                  </div>
                </div>
              </div>
            )}

            {/* No insights fallback */}
            {annualSavingsOpportunity <= 50 && trialSubscriptions.length === 0 && duplicateCategories.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Great job! Your subscriptions are well optimized.</p>
                <p className="text-sm mt-1">Keep monitoring for new optimization opportunities.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-primary/10 rounded-lg">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Upcoming Renewals</h3>
              <p className="text-sm text-muted-foreground">{upcomingRenewals.length} renewal{upcomingRenewals.length !== 1 ? 's' : ''} this week</p>
            </div>
            <div className="text-center p-4 bg-gradient-success/10 rounded-lg">
              <Target className="h-8 w-8 text-success mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Monthly Budget</h3>
              <p className="text-sm text-muted-foreground">Current: ${currentMonthSpending.toFixed(2)}/month</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};