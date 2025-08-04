import { Home, CreditCard, Calendar, PieChart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "analytics", label: "Analytics", icon: PieChart },
  { id: "settings", label: "Settings", icon: Settings },
];

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border/50 z-50 animate-slide-up">
      <div className="flex items-center justify-around px-2 py-3">
        {navigation.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 hover-scale",
                isActive
                  ? "text-primary bg-primary/10 shadow-button scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={cn(
                "relative transition-transform duration-200",
                isActive && "animate-bounce-in"
              )}>
                <Icon className="h-5 w-5" />
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};