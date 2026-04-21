import React from 'react';
import { Sun, Moon, Plus, TrendingUp, LayoutDashboard, List, BarChart3, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const { darkMode, setDarkMode, setShowForm, setEditingExpense, setShowIncomeForm, setEditingIncome, activeTab, setActiveTab } = useApp();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: List },
    { id: 'income', label: 'Income', icon: TrendingUp },
    { id: 'charts', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">₹</div>
        <span className="brand-name">SpendWise</span>
      </div>

      <div className="navbar-tabs">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`tab-btn ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="navbar-actions">
        <button className="icon-btn" onClick={() => setDarkMode(d => !d)} title="Toggle theme">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="add-btn income-add-btn" onClick={() => { setEditingIncome(null); setShowIncomeForm(true); }}>
          <TrendingUp size={16} />
          <span>Income</span>
        </button>
        <button className="add-btn" onClick={() => { setEditingExpense(null); setShowForm(true); }}>
          <Plus size={16} />
          <span>Expense</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
