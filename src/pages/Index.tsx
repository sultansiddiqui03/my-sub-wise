import { useState } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { Dashboard } from "@/pages/Dashboard";
import { Subscriptions } from "@/pages/Subscriptions";
import { Calendar } from "@/pages/Calendar";
import { Analytics } from "@/pages/Analytics";
import { Settings } from "@/pages/Settings";
import { AddSubscription } from "@/pages/AddSubscription";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddSubscription, setShowAddSubscription] = useState(false);

  const handleAddSubscription = () => {
    setShowAddSubscription(true);
  };

  const handleCloseAddSubscription = () => {
    setShowAddSubscription(false);
  };

  const handleSaveSubscription = (subscription: any) => {
    // In a real app, this would save to a database
    console.log("Saving subscription:", subscription);
    setShowAddSubscription(false);
  };

  if (showAddSubscription) {
    return (
      <AddSubscription
        onClose={handleCloseAddSubscription}
        onSave={handleSaveSubscription}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "subscriptions":
        return <Subscriptions onAddSubscription={handleAddSubscription} />;
      case "calendar":
        return <Calendar />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard onAddSubscription={handleAddSubscription} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderContent()}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
