import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, DollarSign, Calendar } from 'lucide-react';

const SummaryCards = ({ transactions }) => {
  // Calculate total expenses
  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Get categories breakdown for top spending
  const categoryBreakdown = transactions.reduce((acc, t) => {
    const category = t.category || 'Uncategorized';
    if (!acc[category]) acc[category] = 0;
    acc[category] += t.amount;
    return acc;
  }, {});
  
  // Find top spending category
  let topCategory = { name: 'None', amount: 0 };
  Object.entries(categoryBreakdown).forEach(([name, amount]) => {
    if (amount > topCategory.amount) {
      topCategory = { name, amount };
    }
  });
  
  // Get recent transactions (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentTotal = transactions
    .filter(t => new Date(t.date) >= thirtyDaysAgo)
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Get most recent transaction
  let mostRecent = { date: new Date(0) };
  transactions.forEach(t => {
    const transactionDate = new Date(t.date);
    if (transactionDate > mostRecent.date) {
      mostRecent = { ...t, date: transactionDate };
    }
  });
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Lifetime spending
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Spending</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${recentTotal.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Last 30 days
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          <ArrowUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topCategory.name}</div>
          <p className="text-xs text-muted-foreground">
            ${topCategory.amount.toFixed(2)} total spent
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Latest Transaction</CardTitle>
          <ArrowDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate">
            {mostRecent.description || 'None'}
          </div>
          <p className="text-xs text-muted-foreground">
            {mostRecent.date !== new Date(0) 
              ? `$${mostRecent.amount?.toFixed(2)} on ${mostRecent.date.toLocaleDateString()}`
              : 'No transactions yet'
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards