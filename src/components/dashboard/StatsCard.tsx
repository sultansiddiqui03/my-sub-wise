import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  trend?: "up" | "down" | "stable";
  icon?: React.ReactNode;
  className?: string;
}

export const StatsCard = ({ title, value, change, trend, icon, className }: StatsCardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-success";
      case "down":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className={cn("card-enhanced hover-lift transition-all duration-500 group", className)}>
      <CardContent className="p-6 relative overflow-hidden">
        {/* Animated Background Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                {value}
              </p>
              {change !== undefined && (
                <div className="flex items-center gap-1 animate-fade-in">
                  <div className="p-1 rounded-full bg-background/50">
                    {getTrendIcon()}
                  </div>
                  <span className={cn("text-sm font-medium", getTrendColor())}>
                    {change > 0 ? "+" : ""}{change}%
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              )}
            </div>
            {icon && (
              <div className="p-3 bg-primary/10 rounded-xl shadow-button group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
                {icon}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};