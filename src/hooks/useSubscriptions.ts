import { useState, useEffect } from 'react';
import { Subscription } from '@/components/subscriptions/SubscriptionCard';

const STORAGE_KEY = 'subwise_subscriptions';

const defaultSubscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Netflix',
    category: 'entertainment',
    cost: 15.99,
    billingCycle: 'monthly',
    nextBilling: '2024-08-15',
    status: 'active',
    description: 'Streaming service'
  },
  {
    id: '2',
    name: 'Spotify Premium',
    category: 'entertainment',
    cost: 9.99,
    billingCycle: 'monthly',
    nextBilling: '2024-08-12',
    status: 'active',
    description: 'Music streaming'
  },
  {
    id: '3',
    name: 'Adobe Creative Suite',
    category: 'productivity',
    cost: 52.99,
    billingCycle: 'monthly',
    nextBilling: '2024-08-20',
    status: 'active',
    description: 'Design software'
  },
  {
    id: '4',
    name: 'ChatGPT Plus',
    category: 'productivity',
    cost: 20.00,
    billingCycle: 'monthly',
    nextBilling: '2024-08-08',
    status: 'trial',
    description: 'AI assistant'
  },
  {
    id: '5',
    name: 'Gym Membership',
    category: 'health',
    cost: 49.99,
    billingCycle: 'monthly',
    nextBilling: '2024-08-25',
    status: 'active',
    description: 'Fitness center'
  },
  {
    id: '6',
    name: 'Dropbox Plus',
    category: 'productivity',
    cost: 119.88,
    billingCycle: 'yearly',
    nextBilling: '2024-12-15',
    status: 'active',
    description: 'Cloud storage'
  }
];

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSubscriptions(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading subscriptions:', error);
        setSubscriptions(defaultSubscriptions);
      }
    } else {
      setSubscriptions(defaultSubscriptions);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
    }
  }, [subscriptions, loading]);

  const addSubscription = (subscription: Omit<Subscription, 'id'>) => {
    const newSubscription: Subscription = {
      ...subscription,
      id: Date.now().toString()
    };
    setSubscriptions(prev => [...prev, newSubscription]);
    return newSubscription;
  };

  const updateSubscription = (id: string, updates: Partial<Subscription>) => {
    setSubscriptions(prev => 
      prev.map(sub => sub.id === id ? { ...sub, ...updates } : sub)
    );
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  };

  const getActiveSubscriptions = () => {
    return subscriptions.filter(sub => sub.status === 'active');
  };

  const getTrialSubscriptions = () => {
    return subscriptions.filter(sub => sub.status === 'trial');
  };

  const getTotalMonthlySpending = () => {
    return subscriptions
      .filter(sub => sub.status === 'active')
      .reduce((total, sub) => {
        if (sub.billingCycle === 'monthly') return total + sub.cost;
        if (sub.billingCycle === 'yearly') return total + (sub.cost / 12);
        if (sub.billingCycle === 'quarterly') return total + (sub.cost / 3);
        return total;
      }, 0);
  };

  const getUpcomingRenewals = (days: number = 7) => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    return subscriptions
      .filter(sub => sub.status === 'active' || sub.status === 'trial')
      .filter(sub => {
        const renewalDate = new Date(sub.nextBilling);
        return renewalDate >= now && renewalDate <= futureDate;
      })
      .sort((a, b) => new Date(a.nextBilling).getTime() - new Date(b.nextBilling).getTime());
  };

  const getCategorySpending = () => {
    const categoryTotals: Record<string, number> = {};
    
    subscriptions
      .filter(sub => sub.status === 'active')
      .forEach(sub => {
        const monthlyAmount = sub.billingCycle === 'monthly' ? sub.cost :
                            sub.billingCycle === 'yearly' ? sub.cost / 12 :
                            sub.billingCycle === 'quarterly' ? sub.cost / 3 : sub.cost;
        
        categoryTotals[sub.category] = (categoryTotals[sub.category] || 0) + monthlyAmount;
      });

    return categoryTotals;
  };

  return {
    subscriptions,
    loading,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    getActiveSubscriptions,
    getTrialSubscriptions,
    getTotalMonthlySpending,
    getUpcomingRenewals,
    getCategorySpending
  };
};