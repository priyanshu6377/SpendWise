import React from 'react';
import { LayoutDashboard, List, BarChart3, Settings, Plus, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

const MobileNav = () => {
  const { activeTab, setActiveTab, setShowForm, setEditingExpense } = useApp();

  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard },
    { id: 'expenses', icon: List },
    { id: 'add-expense', icon: Plus, isAddExpense: true },
    { id: 'income', icon: TrendingUp },
    { id: 'charts', icon: BarChart3 },
    { id: 'settings', icon: Settings },
  ];

  return (
    <nav className="mobile-nav">
      {tabs.map(({ id, icon: Icon, isAddExpense }) => (
        <button
          key={id}
          className={`mobile-nav-btn ${isAddExpense ? 'add-center' : ''} ${activeTab === id ? 'active' : ''}`}
          onClick={() => {
            if (isAddExpense) { setEditingExpense(null); setShowForm(true); }
            else setActiveTab(id);
          }}
        >
          <Icon size={isAddExpense ? 20 : 19} />
        </button>
      ))}
    </nav>
  );
};

export default MobileNav;
