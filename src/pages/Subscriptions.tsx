import { useState } from "react";
import { SubscriptionCard, Subscription } from "@/components/subscriptions/SubscriptionCard";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Plus, SortAsc } from "lucide-react";

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
  },
  {
    id: "5",
    name: "Dropbox",
    category: "utilities",
    cost: 119.88,
    billingCycle: "yearly",
    nextBilling: "2025-03-15",
    status: "active",
    description: "Cloud storage"
  },
  {
    id: "6",
    name: "Gym Membership",
    category: "health",
    cost: 49.99,
    billingCycle: "monthly",
    nextBilling: "2024-08-01",
    status: "cancelled",
    description: "Fitness center access"
  }
];

const categories = ["all", "entertainment", "productivity", "utilities", "shopping", "finance", "health", "education"];
const statuses = ["all", "active", "trial", "cancelled"];

export const Subscriptions = () => {
  const navigate = useNavigate();
  const { 
    subscriptions, 
    loading,
    updateSubscription,
    deleteSubscription
  } = useSubscriptions();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "cost" | "date">("name");

  if (loading) {
    return <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>;
  }

  const handleEditSubscription = (subscription: any) => {
    navigate('/add-subscription', { state: { editingSubscription: subscription } });
  };

  const handleCancelSubscription = (subscription: any) => {
    if (confirm(`Are you sure you want to cancel ${subscription.name}?`)) {
      updateSubscription(subscription.id, { status: 'cancelled' });
    }
  };

  const filteredSubscriptions = subscriptions
    .filter(sub => 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "all" || sub.category === selectedCategory) &&
      (selectedStatus === "all" || sub.status === selectedStatus)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "cost":
          return b.cost - a.cost;
        case "date":
          return new Date(a.nextBilling).getTime() - new Date(b.nextBilling).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const activeSubscriptions = subscriptions.filter(s => s.status === "active");
  const totalMonthly = activeSubscriptions.reduce((sum, sub) => {
    const monthlyCost = sub.billingCycle === "yearly" ? sub.cost / 12 : 
                       sub.billingCycle === "quarterly" ? sub.cost / 3 : sub.cost;
    return sum + monthlyCost;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      {/* Header */}
      <div className="bg-gradient-primary p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Subscriptions</h1>
            <p className="text-primary-foreground/80">Manage all your subscriptions</p>
          </div>
          <Button 
            onClick={() => navigate('/add-subscription')}
            className="bg-white text-primary hover:bg-white/90 shadow-button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Subscription
          </Button>
        </div>

        {/* Summary */}
        <Card className="bg-white/10 backdrop-blur border-white/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{activeSubscriptions.length}</div>
                <div className="text-sm text-primary-foreground/80">Active</div>
              </div>
              <div>
                <div className="text-2xl font-bold">${totalMonthly.toFixed(0)}</div>
                <div className="text-sm text-primary-foreground/80">Monthly</div>
              </div>
              <div>
                <div className="text-2xl font-bold">${(totalMonthly * 12).toFixed(0)}</div>
                <div className="text-sm text-primary-foreground/80">Annually</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-6 space-y-6">
        {/* Search and Filters */}
        <Card className="shadow-card">
          <CardContent className="p-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Category:</span>
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                {statuses.map((status) => (
                  <Badge
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "cost" | "date")}
                className="text-sm border border-border rounded-md px-2 py-1 bg-background"
              >
                <option value="name">Name</option>
                <option value="cost">Cost</option>
                <option value="date">Next billing</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Subscription List */}
        <div className="space-y-4">
          {filteredSubscriptions.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No subscriptions found matching your criteria.</p>
                <Button onClick={() => navigate('/add-subscription')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Subscription
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredSubscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                onEdit={handleEditSubscription}
                onCancel={handleCancelSubscription}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};