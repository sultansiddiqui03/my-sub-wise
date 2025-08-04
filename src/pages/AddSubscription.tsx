import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, DollarSign, Calendar, Upload, Search } from "lucide-react";

interface AddSubscriptionProps {
  onClose: () => void;
  onSave: (subscription: any) => void;
}

const popularServices = [
  { name: "Netflix", category: "entertainment", logo: "N", avgCost: 15.99 },
  { name: "Spotify", category: "entertainment", logo: "S", avgCost: 9.99 },
  { name: "Adobe Creative Suite", category: "productivity", logo: "A", avgCost: 52.99 },
  { name: "Microsoft 365", category: "productivity", logo: "M", avgCost: 6.99 },
  { name: "Dropbox", category: "utilities", logo: "D", avgCost: 9.99 },
  { name: "GitHub", category: "productivity", logo: "G", avgCost: 4.00 },
  { name: "Notion", category: "productivity", logo: "N", avgCost: 8.00 },
  { name: "YouTube Premium", category: "entertainment", logo: "Y", avgCost: 11.99 }
];

const categories = [
  "entertainment",
  "productivity", 
  "utilities",
  "shopping",
  "finance",
  "health",
  "education"
];

const billingCycles = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" }
];

export const AddSubscription = ({ onClose, onSave }: AddSubscriptionProps) => {
  const [step, setStep] = useState<"search" | "manual">("search");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    cost: "",
    billingCycle: "monthly",
    nextBilling: "",
    description: "",
    status: "active"
  });

  const handleServiceSelect = (service: typeof popularServices[0]) => {
    setFormData({
      ...formData,
      name: service.name,
      category: service.category,
      cost: service.avgCost.toString()
    });
    setStep("manual");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: Date.now().toString(),
      ...formData,
      cost: parseFloat(formData.cost)
    });
    onClose();
  };

  if (step === "search") {
    return (
      <div className="min-h-screen bg-gradient-bg animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-primary p-6 text-white relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/10 hover-scale"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Add Subscription</h1>
                <p className="text-primary-foreground/80 mt-1">Find your service or add manually</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 stagger-children">
          {/* Search */}
          <Card className="card-enhanced animate-scale-in">
            <CardContent className="p-6">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search for a service..."
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setStep("manual")}
                  className="flex-1 btn-premium hover-scale"
                >
                  Add Manually
                </Button>
                <Button variant="outline" className="flex-1 hover-scale hover:bg-accent">
                  <Upload className="h-4 w-4 mr-2" />
                  Scan Receipt
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Popular Services */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Popular Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {popularServices.map((service) => (
                <div
                  key={service.name}
                  onClick={() => handleServiceSelect(service)}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold">
                      {service.logo}
                    </div>
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {service.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${service.avgCost}</div>
                    <div className="text-sm text-muted-foreground">avg/month</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <div className="bg-gradient-primary p-6 text-white">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep("search")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Add Subscription</h1>
            <p className="text-primary-foreground/80">Enter subscription details</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Netflix, Spotify"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cost and Billing Cycle */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      placeholder="0.00"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billing">Billing Cycle</Label>
                  <Select
                    value={formData.billingCycle}
                    onValueChange={(value) => setFormData({ ...formData, billingCycle: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {billingCycles.map((cycle) => (
                        <SelectItem key={cycle.value} value={cycle.value}>
                          {cycle.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Next Billing Date */}
              <div className="space-y-2">
                <Label htmlFor="nextBilling">Next Billing Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="nextBilling"
                    type="date"
                    value={formData.nextBilling}
                    onChange={(e) => setFormData({ ...formData, nextBilling: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add notes about this subscription..."
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Add Subscription
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};