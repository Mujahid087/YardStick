import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import SummaryCards from './SummaryCards';

const Dashboard = ({ transactions, budgets = [] }) => {
  // Calculate monthly expenses data for bar chart
  const calculateMonthlyData = () => {
    const monthlyData = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0;
      }
      
      monthlyData[monthYear] += transaction.amount;
    });
    
    // Sort by date and format for chart
    return Object.entries(monthlyData)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, total]) => ({
        month: month.substring(5) + '/' + month.substring(0, 4),
        amount: parseFloat(total.toFixed(2))
      }));
  };
  
  // Calculate category data for pie chart
  const calculateCategoryData = () => {
    const categoryData = {};
    
    transactions.forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      
      if (!categoryData[category]) {
        categoryData[category] = 0;
      }
      
      categoryData[category] += transaction.amount;
    });
    
    return Object.entries(categoryData)
      .map(([category, total]) => ({
        name: category,
        value: parseFloat(total.toFixed(2))
      }));
  };
  
  const monthlyData = calculateMonthlyData();
  const categoryData = calculateCategoryData();
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c'];
  
  return (
    <div className="space-y-6">
      <SummaryCards transactions={transactions} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
            <CardDescription>Your spending over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
                  <YAxis label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => ['$' + value.toFixed(2), 'Amount']} />
                  <Bar dataKey="amount" fill="#8884d8" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {categoryData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>Where your money goes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => ['$' + value.toFixed(2), 'Amount']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {budgets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Budget vs. Actual</CardTitle>
            <CardDescription>How you're tracking against your budgets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={budgets.map(budget => {
                    const actualSpent = transactions
                      .filter(t => t.category === budget.category)
                      .reduce((sum, t) => sum + t.amount, 0);
                    
                    return {
                      category: budget.category,
                      budget: budget.amount,
                      actual: actualSpent,
                      remaining: Math.max(budget.amount - actualSpent, 0)
                    };
                  })}
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" label={{ value: 'Amount ($)', position: 'insideBottom', offset: -5 }} />
                  <YAxis type="category" dataKey="category" width={80} />
                  <Tooltip formatter={(value) => ['$' + value.toFixed(2), 'Amount']} />
                  <Legend />
                  <Bar dataKey="actual" fill="#FF8042" name="Actual" stackId="a" />
                  <Bar dataKey="remaining" fill="#82ca9d" name="Remaining" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard