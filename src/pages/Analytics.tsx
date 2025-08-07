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
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

// Generate realistic monthly spending data based on current subscriptions
const generateMonthlyTrend = (currentSpending: number) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  const baseSpending = currentSpending;
  
  return months.map((month, index) => {
    // Create realistic variation (±15% of current spending)
    const variation = (Math.random() - 0.5) * 0.3;
    const seasonalFactor = index < 4 ? 0.95 : 1.05; // Lower in early year, higher in summer
    const amount = baseSpending * (1 + variation) * seasonalFactor;
    
    return {
      month,
      amount: Math.max(amount, baseSpending * 0.7), // Minimum 70% of current
      isCurrentMonth: index === months.length - 1
    };
  });
};

// Custom colors for charts
const CHART_COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  accent: "hsl(var(--accent))",
  muted: "hsl(var(--muted-foreground))",
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  destructive: "hsl(var(--destructive))"
};

const CATEGORY_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  "#8B5CF6", // purple
  "#06B6D4", // cyan
];

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

  // Generate monthly trend data
  const monthlyTrendData = generateMonthlyTrend(currentMonthSpending);
  const categoryChartData = categoryBreakdown.map((cat, index) => ({
    ...cat,
    fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
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

        {/* Spending Trend Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Spending Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={3}
                    dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: CHART_COLORS.primary, strokeWidth: 2 }}
                    className="animate-fade-in"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Spending by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Chart */}
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="category" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `$${value.toFixed(0)}`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, "Monthly Spending"]}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]} className="animate-scale-in">
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Category Details */}
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
                        className={`bg-gradient-primary h-2 rounded-full transition-all duration-500 ease-out animate-fade-in`}
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