// src/app/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import TransactionList from '@/components/TransactionList';
import TransactionForm from '@/components/TransactionForm';
import Dashboard from '@/components/Dashboard';
import BudgetDashboard from '@/components/BudgetDashboard';
import { CATEGORIES } from '@/data/categories';

// Sample initial transactions for demo purposes
const initialTransactions = [
  { id: '1', amount: 50.75, date: '2025-03-10', description: 'Grocery shopping', category: 'Food' },
  { id: '2', amount: 9.99, date: '2025-03-08', description: 'Spotify subscription', category: 'Entertainment' },
  { id: '3', amount: 35.00, date: '2025-03-05', description: 'Gas station', category: 'Transportation' },
  { id: '4', amount: 127.30, date: '2025-03-01', description: 'Electricity bill', category: 'Utilities' },
  { id: '5', amount: 20.00, date: '2025-02-28', description: 'Movie tickets', category: 'Entertainment' },
];

// Sample initial budgets for demo purposes
const initialBudgets = [
  { category: 'Food', amount: 400 },
  { category: 'Entertainment', amount: 150 },
  { category: 'Transportation', amount: 200 },
  { category: 'Utilities', amount: 300 },
  { category: 'Housing', amount: 1200 },
  { category: 'Healthcare', amount: 200 },
  { category: 'Shopping', amount: 150 },
  { category: 'Personal', amount: 100 },
  { category: 'Other', amount: 100 },
];

export default function Home() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [budgets, setBudgets] = useState(initialBudgets);
  const [editTransaction, setEditTransaction] = useState(null);
  const [activeStage, setActiveStage] = useState("stage1");

  // In a real app, you would fetch transactions from your MongoDB backend
  useEffect(() => {
    // fetchTransactions();
    // fetchBudgets();
  }, []);

  const handleAddTransaction = (transaction) => {
    if (editTransaction) {
      // Update existing transaction
      setTransactions(transactions.map(t => 
        t.id === transaction.id ? transaction : t
      ));
      setEditTransaction(null);
    } else {
      // Add new transaction with unique ID
      const newTransaction = {
        ...transaction,
        id: Date.now().toString()
      };
      setTransactions([...transactions, newTransaction]);
    }
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleEditTransaction = (transaction) => {
    setEditTransaction(transaction);
  };

  const handleUpdateBudget = (category, amount) => {
    setBudgets(budgets.map(b => 
      b.category === category ? { ...b, amount } : b
    ));
  };

  // Determine content based on active stage
  const renderStageContent = () => {
    switch (activeStage) {
      case "stage1":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TransactionForm 
                onAdd={handleAddTransaction} 
                editTransaction={editTransaction}
                showCategories={false}
              />
              <TransactionList 
                transactions={transactions} 
                onDelete={handleDeleteTransaction}
                onEdit={handleEditTransaction}
                showCategories={false}
              />
            </div>
          </>
        );
      case "stage2":
        return (
          <Tabs defaultValue="dashboard">
            <TabsList className="mb-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <Dashboard transactions={transactions} />
            </TabsContent>
            <TabsContent value="transactions">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TransactionForm 
                  onAdd={handleAddTransaction} 
                  editTransaction={editTransaction}
                  categories={CATEGORIES}
                  showCategories={true}
                />
                <TransactionList 
                  transactions={transactions} 
                  onDelete={handleDeleteTransaction}
                  onEdit={handleEditTransaction}
                  showCategories={true}
                />
              </div>
            </TabsContent>
          </Tabs>
        );
      case "stage3":
        return (
          <Tabs defaultValue="dashboard">
            <TabsList className="mb-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="budgets">Budgets</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <Dashboard transactions={transactions} budgets={budgets} />
            </TabsContent>
            <TabsContent value="budgets">
              <BudgetDashboard 
                transactions={transactions} 
                budgets={budgets} 
                onUpdateBudget={handleUpdateBudget}
              />
            </TabsContent>
            <TabsContent value="transactions">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TransactionForm 
                  onAdd={handleAddTransaction} 
                  editTransaction={editTransaction}
                  categories={CATEGORIES}
                  showCategories={true}
                />
                <TransactionList 
                  transactions={transactions} 
                  onDelete={handleDeleteTransaction}
                  onEdit={handleEditTransaction}
                  showCategories={true}
                />
              </div>
            </TabsContent>
          </Tabs>
        );
      default:
        return <div>Select a stage</div>;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Personal Finance Tracker</h1>
      
      <div className="mb-6">
        <Tabs value={activeStage} onValueChange={setActiveStage} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="stage1" className="flex-1">Basic Tracking</TabsTrigger>
            <TabsTrigger value="stage2" className="flex-1">Categories</TabsTrigger>
            <TabsTrigger value="stage3" className="flex-1">Budgeting</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {renderStageContent()}
    </div>
  );
}