import { useState } from "react";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  name: string;
  cost: number;
  category: string;
  status: "active" | "trial" | "cancelled";
}

const mockEvents: Record<string, CalendarEvent[]> = {
  "2024-08-08": [
    { id: "1", name: "ChatGPT Plus", cost: 20.00, category: "productivity", status: "trial" }
  ],
  "2024-08-12": [
    { id: "2", name: "Spotify", cost: 9.99, category: "entertainment", status: "active" }
  ],
  "2024-08-15": [
    { id: "3", name: "Netflix", cost: 15.99, category: "entertainment", status: "active" }
  ],
  "2024-08-20": [
    { id: "4", name: "Adobe Creative Suite", cost: 52.99, category: "productivity", status: "active" }
  ],
  "2024-08-25": [
    { id: "5", name: "Gym Membership", cost: 49.99, category: "health", status: "active" }
  ]
};

const categoryColors = {
  entertainment: "bg-category-entertainment/10 text-category-entertainment",
  productivity: "bg-category-productivity/10 text-category-productivity",
  utilities: "bg-category-utilities/10 text-category-utilities",
  shopping: "bg-category-shopping/10 text-category-shopping",
  finance: "bg-category-finance/10 text-category-finance",
  health: "bg-category-health/10 text-category-health",
  education: "bg-category-education/10 text-category-education",
};

export const Calendar = () => {
  const { subscriptions, loading } = useSubscriptions();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "list">("month");

  const today = new Date();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days = [];
  const currentDateIterator = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDateIterator));
    currentDateIterator.setDate(currentDateIterator.getDate() + 1);
  }

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (date: Date) => {
    return subscriptions.filter(sub => {
      const billingDate = new Date(sub.nextBilling);
      return billingDate.toDateString() === date.toDateString() && 
             (sub.status === 'active' || sub.status === 'trial');
    });
  };

  const getTotalForDate = (date: Date) => {
    const events = getEventsForDate(date);
    return events.reduce((sum, event) => sum + event.cost, 0);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return subscriptions
      .filter(sub => (sub.status === 'active' || sub.status === 'trial'))
      .filter(sub => {
        const billingDate = new Date(sub.nextBilling);
        return billingDate >= today && billingDate <= thirtyDaysFromNow;
      })
      .map(sub => ({ ...sub, date: new Date(sub.nextBilling) }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  if (viewMode === "list") {
    const upcomingEvents = getUpcomingEvents();
    const totalUpcoming = upcomingEvents.reduce((sum, event) => sum + event.cost, 0);

    return (
      <div className="min-h-screen bg-gradient-bg pb-20">
        {/* Header */}
        <div className="bg-gradient-primary p-6 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Calendar</h1>
              <p className="text-primary-foreground/80">Upcoming renewals</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("month")}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Month
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("list")}
                className="bg-white text-primary hover:bg-white/90"
              >
                List
              </Button>
            </div>
          </div>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  <span className="font-semibold">Next 30 days total:</span>
                </div>
                <span className="text-2xl font-bold">${totalUpcoming.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <Card key={`${event.id}-${index}`} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {event.date.getDate()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {monthNames[event.date.getMonth()].slice(0, 3)}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{event.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={categoryColors[event.category as keyof typeof categoryColors]}>
                            {event.category}
                          </Badge>
                          <Badge variant={event.status === "trial" ? "secondary" : "outline"}>
                            {event.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">
                        ${event.cost.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {event.date.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      {/* Header */}
      <div className="bg-gradient-primary p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Calendar</h1>
            <p className="text-primary-foreground/80">Subscription renewals</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("month")}
              className="bg-white text-primary hover:bg-white/90"
            >
              Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("list")}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              List
            </Button>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("prev")}
            className="text-white hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("next")}
            className="text-white hover:bg-white/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const events = getEventsForDate(day);
                const total = getTotalForDate(day);
                const hasEvents = events.length > 0;

                return (
                  <div
                    key={index}
                    className={cn(
                      "min-h-[80px] p-2 border border-border rounded-lg transition-all duration-200",
                      isCurrentMonth(day) ? "bg-card" : "bg-muted/30",
                      isToday(day) && "bg-primary/10 border-primary",
                      hasEvents && "border-primary/30",
                      "hover:bg-accent cursor-pointer"
                    )}
                  >
                    <div className={cn(
                      "text-sm font-medium mb-1",
                      isCurrentMonth(day) ? "text-foreground" : "text-muted-foreground",
                      isToday(day) && "text-primary font-bold"
                    )}>
                      {day.getDate()}
                    </div>
                    
                    {hasEvents && (
                      <div className="space-y-1">
                        {events.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className="text-xs px-2 py-1 rounded bg-primary/10 text-primary truncate"
                          >
                            {event.name}
                          </div>
                        ))}
                        {events.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{events.length - 2} more
                          </div>
                        )}
                        <div className="text-xs font-medium text-foreground">
                          ${total.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};