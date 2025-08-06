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
  const { subscriptions, loading, getTotalMonthlySpending, getCategorySpending } = useSubscriptions();

  if (loading) {
    return <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>;
  }

  const currentMonthSpending = getTotalMonthlySpending();
  const categorySpending = getCategorySpending();
  const yearlyProjection = currentMonthSpending * 12;
  const totalSavingsOpportunity = 156 + 20; // Mock value for now

  const categoryBreakdown = Object.entries(categorySpending).map(([category, amount]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    amount: amount,
    percentage: Math.round((amount / currentMonthSpending) * 100),
    color: `category-${category}`
  }));

  const monthOverMonthChange = 12.5; // Mock value for now

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
              Savings Opportunity
            </div>
            <div className="text-2xl font-bold">${totalSavingsOpportunity}</div>
            <div className="text-sm text-primary-foreground/80">Potential monthly savings</div>
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
            value={mockAnalytics.categoryBreakdown.length.toString()}
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
              {mockAnalytics.categoryBreakdown.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={`bg-${category.color}/10 text-${category.color}`}>
                        {category.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{category.percentage}%</span>
                    </div>
                    <span className="font-bold">${category.amount}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`bg-gradient-primary h-2 rounded-full`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
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
            {mockAnalytics.insights.map((insight, index) => {
              const getIcon = () => {
                switch (insight.type) {
                  case "warning":
                    return <AlertTriangle className="h-5 w-5 text-warning" />;
                  case "success":
                    return <TrendingUp className="h-5 w-5 text-success" />;
                  default:
                    return <DollarSign className="h-5 w-5 text-primary" />;
                }
              };

              const getBgColor = () => {
                switch (insight.type) {
                  case "warning":
                    return "bg-warning/10 border-warning/20";
                  case "success":
                    return "bg-success/10 border-success/20";
                  default:
                    return "bg-primary/10 border-primary/20";
                }
              };

              return (
                <div key={index} className={`p-4 rounded-lg border ${getBgColor()}`}>
                  <div className="flex items-start gap-3">
                    {getIcon()}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                      <p className="text-sm font-medium text-primary">{insight.action}</p>
                    </div>
                  </div>
                </div>
              );
            })}
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
              <h3 className="font-semibold mb-1">Review Upcoming</h3>
              <p className="text-sm text-muted-foreground">3 renewals this week</p>
            </div>
            <div className="text-center p-4 bg-gradient-success/10 rounded-lg">
              <Target className="h-8 w-8 text-success mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Set Budget Goal</h3>
              <p className="text-sm text-muted-foreground">Target: $120/month</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};