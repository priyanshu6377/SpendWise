import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext';

const BudgetProgress = () => {
  const { budget, currentMonthExpenses, currentMonthIncome, isOverBudget } = useApp();

  const formatCurrency = (val) =>
    `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  const budgetAmt = Number(budget.amount);
  // Net spending = expenses - income (if income covers some expenses)
  const netSpending = Math.max(0, currentMonthExpenses - currentMonthIncome);
  const rawNet = currentMonthExpenses - currentMonthIncome;

  // Percentages relative to budget
  const incomeBarPct  = budgetAmt > 0 ? Math.min((currentMonthIncome / budgetAmt) * 100, 100) : 0;
  const expenseBarPct = budgetAmt > 0 ? Math.min((currentMonthExpenses / budgetAmt) * 100, 100) : 0;
  const netBarPct     = budgetAmt > 0 ? Math.min((netSpending / budgetAmt) * 100, 100) : 0;

  return (
    <div className="budget-progress-card">
      <div className="budget-progress-header">
        <div>
          <h3>Monthly Budget Overview</h3>
          <p>Budget: {formatCurrency(budgetAmt)} / month</p>
        </div>
        <Wallet size={24} />
      </div>

      {/* ── Income Bar ── */}
      <div className="budget-bar-row">
        <div className="budget-bar-label">
          <TrendingUp size={14} className="bar-icon income-icon" />
          <span>Income</span>
          <span className="bar-amount income-color">{formatCurrency(currentMonthIncome)}</span>
        </div>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill income-fill"
            style={{ width: `${incomeBarPct}%` }}
          />
        </div>
        <span className="bar-pct income-color">{incomeBarPct.toFixed(0)}%</span>
      </div>

      {/* ── Expense Bar ── */}
      <div className="budget-bar-row">
        <div className="budget-bar-label">
          <TrendingDown size={14} className="bar-icon expense-icon" />
          <span>Expenses</span>
          <span className="bar-amount expense-color">{formatCurrency(currentMonthExpenses)}</span>
        </div>
        <div className="progress-bar-track">
          <div
            className={`progress-bar-fill expense-fill ${isOverBudget ? 'over' : expenseBarPct > 75 ? 'warning' : ''}`}
            style={{ width: `${expenseBarPct}%` }}
          />
        </div>
        <span className="bar-pct expense-color">{expenseBarPct.toFixed(0)}%</span>
      </div>

      {/* ── Net Bar ── */}
      <div className="budget-bar-row">
        <div className="budget-bar-label">
          <Minus size={14} className="bar-icon net-icon" />
          <span>Net Spending</span>
          <span className={`bar-amount ${rawNet <= 0 ? 'income-color' : 'net-color'}`}>
            {rawNet <= 0 ? `Saved ${formatCurrency(Math.abs(rawNet))}` : formatCurrency(netSpending)}
          </span>
        </div>
        <div className="progress-bar-track">
          {rawNet <= 0 ? (
            <div className="progress-bar-fill income-fill" style={{ width: '100%' }} />
          ) : (
            <div
              className={`progress-bar-fill net-fill ${netBarPct > 90 ? 'over' : ''}`}
              style={{ width: `${netBarPct}%` }}
            />
          )}
        </div>
        <span className={`bar-pct ${rawNet <= 0 ? 'income-color' : 'net-color'}`}>
          {rawNet <= 0 ? '✓' : `${netBarPct.toFixed(0)}%`}
        </span>
      </div>

      {/* Summary row */}
      <div className="budget-summary-row">
        <div className={`budget-summary-chip ${rawNet <= 0 ? 'surplus' : isOverBudget ? 'over-budget' : 'safe'}`}>
          {rawNet <= 0
            ? `🎉 Income covers all expenses — Surplus ₹${Math.abs(rawNet).toLocaleString('en-IN')}`
            : isOverBudget
            ? `⚠️ Over budget by ₹${(currentMonthExpenses - budgetAmt).toLocaleString('en-IN')}`
            : `✅ ₹${(budgetAmt - netSpending).toLocaleString('en-IN')} remaining in budget`}
        </div>
      </div>
    </div>
  );
};

export default BudgetProgress;
