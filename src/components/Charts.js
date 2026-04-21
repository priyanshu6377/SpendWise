import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend, LineChart, Line, CartesianGrid,
} from 'recharts';
import { useApp, CATEGORIES } from '../context/AppContext';
import { format, parseISO, startOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

const CATEGORY_ICONS = {
  food: '🍔', travel: '✈️', shopping: '🛍️',
  entertainment: '🎬', health: '💊', utilities: '⚡',
  education: '📚', other: '📌',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        {label && <p className="tooltip-label">{label}</p>}
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color || entry.fill }}>
            {entry.name}: ₹{Number(entry.value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Charts = () => {
  const { expenses } = useApp();
  const [chartType, setChartType] = useState('pie');

  const formatCurrency = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

  // Category data for current month
  const now = new Date();
  const monthExpenses = expenses.filter(exp => {
    const d = new Date(exp.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const categoryData = CATEGORIES.map(cat => ({
    name: `${CATEGORY_ICONS[cat.id]} ${cat.label}`,
    value: monthExpenses.filter(e => e.category === cat.id).reduce((s, e) => s + Number(e.amount), 0),
    color: cat.color,
    id: cat.id,
  })).filter(d => d.value > 0);

  // Monthly trend — last 6 months
  const last6 = eachMonthOfInterval({
    start: subMonths(now, 5),
    end: now,
  });

  const monthlyData = last6.map(month => {
    const label = format(month, 'MMM yy');
    const total = expenses
      .filter(exp => {
        const d = parseISO(exp.date);
        return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear();
      })
      .reduce((s, e) => s + Number(e.amount), 0);

    // Also break down by category
    const breakdown = {};
    CATEGORIES.forEach(cat => {
      breakdown[cat.id] = expenses
        .filter(exp => {
          const d = parseISO(exp.date);
          return d.getMonth() === month.getMonth() &&
            d.getFullYear() === month.getFullYear() &&
            exp.category === cat.id;
        })
        .reduce((s, e) => s + Number(e.amount), 0);
    });

    return { month: label, total, ...breakdown };
  });

  const topCategories = [...categoryData].sort((a, b) => b.value - a.value).slice(0, 4);

  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📊</div>
        <h2>No data to visualize</h2>
        <p>Add some expenses to see your spending analytics</p>
      </div>
    );
  }

  return (
    <div className="charts-page">
      <div className="chart-tabs">
        {['pie', 'bar', 'trend'].map(type => (
          <button
            key={type}
            className={`chart-tab ${chartType === type ? 'active' : ''}`}
            onClick={() => setChartType(type)}
          >
            {type === 'pie' ? '🥧 Category Split' : type === 'bar' ? '📊 Monthly Bars' : '📈 Trend'}
          </button>
        ))}
      </div>

      <div className="charts-grid">
        {/* Main Chart */}
        <div className="chart-card main-chart">
          {chartType === 'pie' && (
            <>
              <h3>Category Breakdown – {format(now, 'MMMM yyyy')}</h3>
              {categoryData.length === 0 ? (
                <p className="muted center">No expenses this month</p>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%" cy="50%"
                      outerRadius={120} innerRadius={60}
                      dataKey="value"
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {categoryData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </>
          )}

          {chartType === 'bar' && (
            <>
              <h3>Monthly Spending (Last 6 Months)</h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={monthlyData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickFormatter={v => `₹${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  {topCategories.map(cat => (
                    <Bar key={cat.id} dataKey={cat.id} name={cat.name} fill={cat.color} stackId="a" radius={[0, 0, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </>
          )}

          {chartType === 'trend' && (
            <>
              <h3>Spending Trend (Last 6 Months)</h3>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickFormatter={v => `₹${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone" dataKey="total" name="Total Spent"
                    stroke="#6366f1" strokeWidth={3}
                    dot={{ fill: '#6366f1', r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
        </div>

        {/* Category Stats */}
        <div className="chart-card stats-breakdown">
          <h3>Category Summary</h3>
          <div className="stats-list">
            {categoryData.length === 0 ? (
              <p className="muted">No data this month</p>
            ) : (
              categoryData.map(cat => (
                <div key={cat.id} className="stats-row">
                  <div className="stats-row-left">
                    <div className="stats-dot" style={{ background: cat.color }} />
                    <span>{cat.name}</span>
                  </div>
                  <span className="stats-val" style={{ color: cat.color }}>
                    {formatCurrency(cat.value)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Monthly Summary Table */}
      <div className="chart-card">
        <h3>Monthly Summary</h3>
        <div className="summary-table">
          <div className="table-head">
            <span>Month</span>
            <span>Expenses</span>
            <span>Total</span>
            <span>Avg/Day</span>
          </div>
          {[...monthlyData].reverse().map((row, i) => {
            const daysInMonth = i === 0 ? now.getDate() : 30;
            const count = expenses.filter(e => {
              const d = parseISO(e.date);
              return format(d, 'MMM yy') === row.month;
            }).length;
            return (
              <div key={row.month} className={`table-row ${i === 0 ? 'current' : ''}`}>
                <span>{row.month}</span>
                <span>{count} items</span>
                <span className="amount-col">{formatCurrency(row.total)}</span>
                <span className="muted">{formatCurrency(row.total / daysInMonth)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Charts;
