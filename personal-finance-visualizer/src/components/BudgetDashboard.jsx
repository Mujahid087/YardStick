import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const BudgetDashboard = ({ transactions, budgets, onUpdateBudget }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedBudgets, setEditedBudgets] = useState({});

  // Memoized budget data to prevent unnecessary recalculations
  const budgetData = useMemo(() => 
    budgets.map((budget) => {
      const actualSpent = transactions
        .filter((t) => t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        category: budget.category,
        budget: budget.amount,
        actual: actualSpent,
        remaining: Math.max(budget.amount - actualSpent, 0),
        percentUsed: budget.amount > 0 ? Math.min((actualSpent / budget.amount) * 100, 100) : 0,
      };
    }), 
    [transactions, budgets]
  );

  // Handle budget input changes
  const handleBudgetChange = (category, value) => {
    setEditedBudgets((prev) => ({
      ...prev,
      [category]: parseFloat(value) || 0,
    }));
  };

  // Save all budget changes
  const saveChanges = () => {
    Object.entries(editedBudgets).forEach(([category, amount]) => {
      onUpdateBudget(category, amount);
    });
    setEditedBudgets({});
    setEditMode(false);
  };

  // Generate spending insights
  const insights = useMemo(() => {
    const insightsList = [];
    let highestSpending = { category: "", actual: 0 };

    let totalBudget = 0;
    let totalActual = 0;

    budgetData.forEach(({ category, budget, actual, percentUsed }) => {
      totalBudget += budget;
      totalActual += actual;

      if (actual > highestSpending.actual) {
        highestSpending = { category, actual };
      }

      if (actual > budget && budget > 0) {
        insightsList.push(`You've exceeded your ${category} budget by $${(actual - budget).toFixed(2)}.`);
      } else if (percentUsed >= 80 && budget > 0) {
        insightsList.push(`You're at ${percentUsed.toFixed(0)}% of your ${category} budget. Consider reducing spending.`);
      }
    });

    if (highestSpending.actual > 0) {
      insightsList.push(`Your highest spending category is ${highestSpending.category} at $${highestSpending.actual.toFixed(2)}.`);
    }

    return insightsList;
  }, [budgetData]);

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>Track your spending vs budget.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="budget" fill="#8884d8" name="Budget" />
              <Bar dataKey="actual" fill="#82ca9d" name="Actual Spent" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Budget Table */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Details</CardTitle>
          <Button onClick={() => setEditMode(!editMode)} variant="outline">
            {editMode ? "Cancel" : "Edit Budgets"}
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>% Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgetData.map(({ category, budget, actual, remaining, percentUsed }) => (
                <TableRow key={category}>
                  <TableCell>{category}</TableCell>
                  <TableCell>
                    {editMode ? (
                      <Input 
                        type="number" 
                        value={editedBudgets[category] ?? budget} 
                        onChange={(e) => handleBudgetChange(category, e.target.value)} 
                      />
                    ) : (
                      `$${budget.toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell>${actual.toFixed(2)}</TableCell>
                  <TableCell>${remaining.toFixed(2)}</TableCell>
                  <TableCell>
                    <Progress value={percentUsed} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {editMode && <Button onClick={saveChanges}>Save Changes</Button>}
        </CardContent>
      </Card>

      {/* Spending Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Spending Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {insights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BudgetDashboard;
