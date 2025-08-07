import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  ArrowLeft,
  Upload,
  Search,
  Plus,
  Calendar,
  DollarSign,
  Tag,
  CreditCard,
  Zap
} from "lucide-react";

interface AddSubscriptionProps {
  onClose?: () => void;
  onSave?: (subscription: any) => void;
}

export const AddSubscription = ({ onClose, onSave }: AddSubscriptionProps = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addSubscription, updateSubscription } = useSubscriptions();
  
  const [step, setStep] = useState<"method" | "manual" | "template">("method");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    cost: "",
    billingCycle: "",
    nextBilling: "",
    status: "active" as const,
    description: ""
  });

  const editingSubscription = location.state?.editingSubscription;
  const isEditing = !!editingSubscription;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: editingSubscription.name,
        category: editingSubscription.category,
        cost: editingSubscription.cost.toString(),
        billingCycle: editingSubscription.billingCycle,
        nextBilling: editingSubscription.nextBilling,
        status: editingSubscription.status,
        description: editingSubscription.description || ""
      });
      setStep("manual");
    }
  }, [editingSubscription, isEditing]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.cost || !formData.billingCycle || !formData.nextBilling) {
      toast.error("Please fill in all required fields");
      return;
    }

    const subscriptionData = {
      name: formData.name,
      category: formData.category as any,
      cost: parseFloat(formData.cost),
      billingCycle: formData.billingCycle as any,
      nextBilling: formData.nextBilling,
      status: formData.status,
      description: formData.description
    };

    try {
      if (isEditing) {
        updateSubscription(editingSubscription.id, subscriptionData);
        toast.success("Subscription updated successfully!");
      } else {
        addSubscription(subscriptionData);
        toast.success("Subscription added successfully!");
      }
      navigate('/subscriptions');
    } catch (error) {
      toast.error("Failed to save subscription");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      {/* Header */}
      <div className="bg-gradient-primary p-6 text-white">
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover-scale"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Edit Subscription' : 'Add Subscription'}
            </h1>
            <p className="text-primary-foreground/80">
              {isEditing ? 'Update subscription details' : 'Track a new subscription service'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Card className="shadow-card">
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Netflix, Spotify, Adobe Creative Suite"
                className="focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="productivity">Productivity</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="health">Health & Fitness</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Cost *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => handleInputChange('cost', e.target.value)}
                    placeholder="0.00"
                    className="pl-10 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="billing">Billing Cycle *</Label>
                <Select value={formData.billingCycle} onValueChange={(value) => handleInputChange('billingCycle', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextBilling">Next Billing Date *</Label>
              <Input
                id="nextBilling"
                type="date"
                value={formData.nextBilling}
                onChange={(e) => handleInputChange('nextBilling', e.target.value)}
                className="focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Add notes about this subscription..."
                className="resize-none focus:ring-primary"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button className="flex-1 btn-premium" onClick={handleSubmit}>
                {isEditing ? 'Update Subscription' : 'Add Subscription'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};