import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const CATEGORIES = [
  { id: 'food', label: 'Food & Dining', color: '#FF6B6B', bg: '#FF6B6B20' },
  { id: 'travel', label: 'Travel', color: '#4ECDC4', bg: '#4ECDC420' },
  { id: 'shopping', label: 'Shopping', color: '#F59E0B', bg: '#F59E0B20' },
  { id: 'entertainment', label: 'Entertainment', color: '#A855F7', bg: '#A855F720' },
  { id: 'health', label: 'Health & Fitness', color: '#22C55E', bg: '#22C55E20' },
  { id: 'utilities', label: 'Utilities', color: '#3B82F6', bg: '#3B82F620' },
  { id: 'education', label: 'Education', color: '#F97316', bg: '#F9731620' },
  { id: 'other', label: 'Other', color: '#94A3B8', bg: '#94A3B820' },
];

export const INCOME_CATEGORIES = [
  { id: 'salary', label: 'Salary', color: '#22C55E', bg: '#22C55E20' },
  { id: 'freelance', label: 'Freelance', color: '#3B82F6', bg: '#3B82F620' },
  { id: 'business', label: 'Business', color: '#6366F1', bg: '#6366F120' },
  { id: 'investment', label: 'Investment', color: '#F59E0B', bg: '#F59E0B20' },
  { id: 'rental', label: 'Rental', color: '#4ECDC4', bg: '#4ECDC420' },
  { id: 'gift', label: 'Gift', color: '#EC4899', bg: '#EC489920' },
  { id: 'refund', label: 'Refund', color: '#F97316', bg: '#F9731620' },
  { id: 'other', label: 'Other', color: '#94A3B8', bg: '#94A3B820' },
];

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [incomes, setIncomes] = useState(() => {
    const saved = localStorage.getItem('incomes');
    return saved ? JSON.parse(saved) : [];
  });

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('budget');
    return saved ? JSON.parse(saved) : { amount: 0, period: 'monthly' };
  });

  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [filters, setFilters] = useState({
    category: 'all', dateFrom: '', dateTo: '', search: '',
  });

  useEffect(() => { localStorage.setItem('expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('incomes', JSON.stringify(incomes)); }, [incomes]);
  useEffect(() => { localStorage.setItem('budget', JSON.stringify(budget)); }, [budget]);
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const addExpense = (expense) => {
    setExpenses(prev => [{ ...expense, id: Date.now().toString(), createdAt: new Date().toISOString() }, ...prev]);
  };
  const updateExpense = (id, updated) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
  };
  const deleteExpense = (id) => setExpenses(prev => prev.filter(e => e.id !== id));

  const addIncome = (income) => {
    setIncomes(prev => [{ ...income, id: 'inc_' + Date.now().toString(), createdAt: new Date().toISOString() }, ...prev]);
  };
  const updateIncome = (id, updated) => {
    setIncomes(prev => prev.map(i => i.id === id ? { ...i, ...updated } : i));
  };
  const deleteIncome = (id) => setIncomes(prev => prev.filter(i => i.id !== id));

  const filteredExpenses = expenses.filter(exp => {
    const matchCategory = filters.category === 'all' || exp.category === filters.category;
    const matchSearch = !filters.search ||
      exp.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      exp.category.toLowerCase().includes(filters.search.toLowerCase());
    const matchDateFrom = !filters.dateFrom || exp.date >= filters.dateFrom;
    const matchDateTo = !filters.dateTo || exp.date <= filters.dateTo;
    return matchCategory && matchSearch && matchDateFrom && matchDateTo;
  });

  const now = new Date();
  const isCurrentMonth = (dateStr) => {
    const d = new Date(dateStr);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };

  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalIncome = incomes.reduce((s, i) => s + Number(i.amount), 0);
  const currentMonthExpenses = expenses.filter(e => isCurrentMonth(e.date)).reduce((s, e) => s + Number(e.amount), 0);
  const currentMonthIncome = incomes.filter(i => isCurrentMonth(i.date)).reduce((s, i) => s + Number(i.amount), 0);
  const netBalance = totalIncome - totalExpenses;
  const currentMonthNet = currentMonthIncome - currentMonthExpenses;
  const budgetUsed = budget.amount > 0 ? (currentMonthExpenses / budget.amount) * 100 : 0;
  const isOverBudget = budget.amount > 0 && currentMonthExpenses > budget.amount;

  return (
    <AppContext.Provider value={{
      darkMode, setDarkMode,
      expenses, incomes, filteredExpenses,
      addExpense, updateExpense, deleteExpense,
      addIncome, updateIncome, deleteIncome,
      budget, setBudget,
      showForm, setShowForm,
      editingExpense, setEditingExpense,
      showIncomeForm, setShowIncomeForm,
      editingIncome, setEditingIncome,
      activeTab, setActiveTab,
      filters, setFilters,
      totalExpenses, totalIncome, netBalance,
      currentMonthExpenses, currentMonthIncome, currentMonthNet,
      budgetUsed, isOverBudget,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
