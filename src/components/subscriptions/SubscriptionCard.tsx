import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Calendar, DollarSign, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Subscription {
  id: string;
  name: string;
  category: "entertainment" | "productivity" | "utilities" | "shopping" | "finance" | "health" | "education";
  cost: number;
  billingCycle: "monthly" | "quarterly" | "yearly";
  nextBilling: string;
  status: "active" | "trial" | "cancelled";
  logo?: string;
  description?: string;
}

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit?: (subscription: Subscription) => void;
  onCancel?: (subscription: Subscription) => void;
}

const categoryColors = {
  entertainment: "bg-category-entertainment/10 text-category-entertainment border-category-entertainment/20",
  productivity: "bg-category-productivity/10 text-category-productivity border-category-productivity/20",
  utilities: "bg-category-utilities/10 text-category-utilities border-category-utilities/20",
  shopping: "bg-category-shopping/10 text-category-shopping border-category-shopping/20",
  finance: "bg-category-finance/10 text-category-finance border-category-finance/20",
  health: "bg-category-health/10 text-category-health border-category-health/20",
  education: "bg-category-education/10 text-category-education border-category-education/20",
};

const statusColors = {
  active: "bg-success/10 text-success border-success/20",
  trial: "bg-warning/10 text-warning border-warning/20",
  cancelled: "bg-muted text-muted-foreground border-border",
};

export const SubscriptionCard = ({ subscription, onEdit, onCancel }: SubscriptionCardProps) => {
  const formatCost = (cost: number, cycle: string) => {
    const symbol = "$";
    const period = cycle === "yearly" ? "/yr" : cycle === "quarterly" ? "/qtr" : "/mo";
    return `${symbol}${cost.toFixed(2)}${period}`;
  };

  const getTimeUntilBilling = (date: string) => {
    const now = new Date();
    const billing = new Date(date);
    const diffTime = billing.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays <= 7) return `${diffDays} days`;
    return new Date(date).toLocaleDateString();
  };

  const isUpcoming = () => {
    const now = new Date();
    const billing = new Date(subscription.nextBilling);
    const diffTime = billing.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  return (
    <Card className="card-enhanced hover-lift group animate-fade-in">
      <CardContent className="p-6 relative">
        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-button group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
                {subscription.logo || subscription.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {subscription.name}
                </h3>
                {subscription.description && (
                  <p className="text-sm text-muted-foreground">{subscription.description}</p>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover-scale">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge className={categoryColors[subscription.category]}>
                {subscription.category}
              </Badge>
              <Badge className={statusColors[subscription.status]}>
                {subscription.status}
              </Badge>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-foreground">
                {formatCost(subscription.cost, subscription.billingCycle)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Next billing:</span>
              <span className={cn(
                "font-medium",
                isUpcoming() ? "text-warning" : "text-foreground"
              )}>
                {getTimeUntilBilling(subscription.nextBilling)}
              </span>
              {isUpcoming() && <AlertCircle className="h-4 w-4 text-warning animate-pulse" />}
            </div>
          </div>

          <div className="flex gap-2 mt-4 pt-4 border-t border-border">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 hover-scale"
              onClick={() => onEdit?.(subscription)}
            >
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-destructive hover:bg-destructive hover:text-destructive-foreground hover-scale"
              onClick={() => onCancel?.(subscription)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};