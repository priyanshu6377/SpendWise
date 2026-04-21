import React, { useState } from 'react';
import { Save, Download, Trash2, Moon, Sun, IndianRupee } from 'lucide-react';
import { useApp, CATEGORIES } from '../context/AppContext';
import { format, parseISO } from 'date-fns';

const Settings = () => {
  const { budget, setBudget, darkMode, setDarkMode, expenses } = useApp();
  const [budgetInput, setBudgetInput] = useState(budget.amount || '');
  const [saved, setSaved] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);

  const handleSaveBudget = () => {
    setBudget({ amount: Number(budgetInput), period: 'monthly' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // CSV Export
  const exportCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount (INR)'];
    const rows = expenses.map(e => [
      e.date,
      `"${e.description}"`,
      CATEGORIES.find(c => c.id === e.category)?.label || e.category,
      e.amount,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAll = () => {
    if (clearConfirm) {
      localStorage.removeItem('expenses');
      window.location.reload();
    } else {
      setClearConfirm(true);
      setTimeout(() => setClearConfirm(false), 4000);
    }
  };

  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="settings-page">
      <h2 className="settings-title">Settings</h2>

      {/* Theme Toggle */}
      <div className="settings-card">
        <div className="settings-card-header">
          <h3>Appearance</h3>
          <p>Customize how SpendWise looks</p>
        </div>
        <div className="settings-row">
          <div className="settings-label">
            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <div
            className={`toggle-switch ${darkMode ? 'on' : ''}`}
            onClick={() => setDarkMode(d => !d)}
          >
            <div className="toggle-knob" />
          </div>
        </div>
      </div>

      {/* Budget */}
      <div className="settings-card">
        <div className="settings-card-header">
          <h3>Monthly Budget</h3>
          <p>Set a spending limit to get alerts when you're close</p>
        </div>
        <div className="budget-setting-row">
          <div className="input-with-icon">
            <IndianRupee size={16} className="input-icon" />
            <input
              type="number"
              placeholder="Enter budget amount"
              value={budgetInput}
              onChange={e => setBudgetInput(e.target.value)}
              min="0"
            />
          </div>
          <button className="btn-primary" onClick={handleSaveBudget}>
            <Save size={16} />
            {saved ? 'Saved!' : 'Save Budget'}
          </button>
        </div>
        {budget.amount > 0 && (
          <p className="budget-hint">
            Current budget: ₹{Number(budget.amount).toLocaleString('en-IN')} / month
          </p>
        )}
      </div>

      {/* Data Management */}
      <div className="settings-card">
        <div className="settings-card-header">
          <h3>Data Management</h3>
          <p>Export or manage your expense data</p>
        </div>
        <div className="data-stats">
          <div className="data-stat">
            <span className="data-stat-value">{expenses.length}</span>
            <span className="data-stat-label">Total Expenses</span>
          </div>
          <div className="data-stat">
            <span className="data-stat-value">₹{Number(totalExpenses).toLocaleString('en-IN')}</span>
            <span className="data-stat-label">Total Spent</span>
          </div>
          <div className="data-stat">
            <span className="data-stat-value">
              {expenses.length > 0 ? format(parseISO(expenses[expenses.length - 1].date), 'dd MMM yy') : '—'}
            </span>
            <span className="data-stat-label">First Entry</span>
          </div>
        </div>

        <div className="data-actions">
          <button className="btn-secondary export-btn" onClick={exportCSV} disabled={expenses.length === 0}>
            <Download size={16} />
            Export as CSV
          </button>
          <button
            className={`btn-danger ${clearConfirm ? 'confirm' : ''}`}
            onClick={handleClearAll}
          >
            <Trash2 size={16} />
            {clearConfirm ? 'Click again to confirm' : 'Clear All Data'}
          </button>
        </div>
      </div>

      {/* About */}
      <div className="settings-card">
        <div className="settings-card-header">
          <h3>About SpendWise</h3>
        </div>
        <p className="about-text">
          SpendWise is a modern personal finance tracker built with React. Track your daily expenses,
          set budgets, and get insights into your spending habits.
        </p>
        <div className="about-tags">
          <span className="tag">React 18</span>
          <span className="tag">Recharts</span>
          <span className="tag">localStorage</span>
          <span className="tag">Lucide Icons</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
