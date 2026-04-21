import React from 'react';
import { TrendingUp, AlertTriangle, Plus, ArrowUpCircle, ArrowDownCircle, Scale } from 'lucide-react';
import { useApp, CATEGORIES, INCOME_CATEGORIES } from '../context/AppContext';
import { format, parseISO } from 'date-fns';
import BudgetProgress from './BudgetProgress';

const EXP_ICONS = { food:'🍔',travel:'✈️',shopping:'🛍️',entertainment:'🎬',health:'💊',utilities:'⚡',education:'📚',other:'📌' };
const INC_ICONS = { salary:'💼',freelance:'💻',business:'🏢',investment:'📈',rental:'🏠',gift:'🎁',refund:'↩️',other:'💵' };

const Dashboard = () => {
  const {
    expenses, incomes,
    totalExpenses, totalIncome, netBalance,
    currentMonthExpenses, currentMonthIncome, currentMonthNet,
    budget, isOverBudget,
    setShowForm, setEditingExpense, setShowIncomeForm, setEditingIncome,
  } = useApp();

  const formatCurrency = (val) =>
    `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const now = new Date();
  const monthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const categoryBreakdown = CATEGORIES.map(cat => ({
    ...cat,
    total: monthExpenses.filter(e => e.category === cat.id).reduce((s, e) => s + Number(e.amount), 0),
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  const allActivity = [
    ...expenses.map(e => ({ ...e, type: 'expense' })),
    ...incomes.map(i => ({ ...i, type: 'income' })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  const hasData = expenses.length > 0 || incomes.length > 0;

  if (!hasData) {
    return (
      <div className="empty-state">
        <div className="empty-icon">💸</div>
        <h2>Welcome to SpendWise!</h2>
        <p>Start by adding your income or expenses</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="btn-success" onClick={() => { setEditingIncome(null); setShowIncomeForm(true); }}>
            <TrendingUp size={16} /> Add Income
          </button>
          <button className="btn-primary" onClick={() => { setEditingExpense(null); setShowForm(true); }}>
            <Plus size={16} /> Add Expense
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {isOverBudget && (
        <div className="budget-alert">
          <AlertTriangle size={18} />
          <span>Budget exceeded! Spent {formatCurrency(currentMonthExpenses)} of {formatCurrency(budget.amount)} budget.</span>
        </div>
      )}

      {/* 6 Stats Cards */}
      <div className="stats-grid stats-grid-6">
        <div className="stat-card accent-green">
          <div className="stat-label"><ArrowUpCircle size={13} style={{display:'inline',marginRight:4}}/>Income This Month</div>
          <div className="stat-value">{formatCurrency(currentMonthIncome)}</div>
          <div className="stat-sub">{incomes.filter(i=>{const d=new Date(i.date);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();}).length} entries</div>
        </div>

        <div className="stat-card accent-red">
          <div className="stat-label"><ArrowDownCircle size={13} style={{display:'inline',marginRight:4}}/>Expenses This Month</div>
          <div className="stat-value">{formatCurrency(currentMonthExpenses)}</div>
          <div className="stat-sub">{monthExpenses.length} transactions</div>
        </div>

        <div className={`stat-card ${currentMonthNet >= 0 ? 'accent-blue' : 'accent-orange'}`}>
          <div className="stat-label"><Scale size={13} style={{display:'inline',marginRight:4}}/>Net This Month</div>
          <div className="stat-value" style={{ color: currentMonthNet >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {currentMonthNet >= 0 ? '+' : ''}{formatCurrency(currentMonthNet)}
          </div>
          <div className="stat-sub">{currentMonthNet >= 0 ? 'Surplus 🎉' : 'Deficit ⚠️'}</div>
        </div>

        <div className="stat-card accent-purple">
          <div className="stat-label">Total Income</div>
          <div className="stat-value">{formatCurrency(totalIncome)}</div>
          <div className="stat-sub">{incomes.length} total entries</div>
        </div>

        <div className="stat-card accent-orange2">
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value">{formatCurrency(totalExpenses)}</div>
          <div className="stat-sub">{expenses.length} total</div>
        </div>

        <div className={`stat-card ${netBalance >= 0 ? 'accent-teal' : 'accent-red'}`}>
          <div className="stat-label">Net Balance</div>
          <div className="stat-value" style={{ color: netBalance >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {netBalance >= 0 ? '+' : ''}{formatCurrency(netBalance)}
          </div>
          <div className="stat-sub">All time</div>
        </div>
      </div>

      {/* Budget: 3-bar component */}
      {budget.amount > 0 && <BudgetProgress />}

      <div className="dashboard-bottom">
        {/* Category Breakdown */}
        <div className="breakdown-card">
          <h3>Top Expense Categories</h3>
          {categoryBreakdown.length === 0 ? (
            <p className="muted">No expenses this month</p>
          ) : (
            <div className="category-list">
              {categoryBreakdown.map(cat => (
                <div key={cat.id} className="category-row">
                  <div className="category-row-left">
                    <span className="cat-emoji">{EXP_ICONS[cat.id]}</span>
                    <span className="cat-name">{cat.label}</span>
                  </div>
                  <div className="category-row-right">
                    <div className="cat-bar-track">
                      <div className="cat-bar-fill" style={{ width:`${(cat.total/currentMonthExpenses)*100}%`, background:cat.color }} />
                    </div>
                    <span className="cat-amount">{formatCurrency(cat.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="recent-card">
          <h3>Recent Activity</h3>
          <div className="recent-list">
            {allActivity.map(item => {
              const isIncome = item.type === 'income';
              const cat = isIncome
                ? INCOME_CATEGORIES.find(c => c.id === item.category)
                : CATEGORIES.find(c => c.id === item.category);
              return (
                <div key={item.id} className="recent-item">
                  <div className="recent-icon" style={{ background: cat?.bg }}>
                    {isIncome ? INC_ICONS[item.category] : EXP_ICONS[item.category]}
                  </div>
                  <div className="recent-info">
                    <div className="recent-desc">{item.description}</div>
                    <div className="recent-date">
                      <span className={`activity-badge ${isIncome ? 'income-badge' : 'expense-badge'}`}>
                        {isIncome ? '+ Income' : '- Expense'}
                      </span>
                      {format(parseISO(item.date), 'dd MMM')}
                    </div>
                  </div>
                  <div className="recent-amount" style={{ color: isIncome ? 'var(--success)' : 'var(--danger)' }}>
                    {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
