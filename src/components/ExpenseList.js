import React, { useState } from 'react';
import { Search, Filter, Edit2, Trash2, X } from 'lucide-react';
import { useApp, CATEGORIES } from '../context/AppContext';
import { format, parseISO } from 'date-fns';

const CATEGORY_ICONS = {
  food: '🍔', travel: '✈️', shopping: '🛍️',
  entertainment: '🎬', health: '💊', utilities: '⚡',
  education: '📚', other: '📌',
};

const ExpenseList = () => {
  const {
    filteredExpenses, deleteExpense,
    setShowForm, setEditingExpense,
    filters, setFilters,
  } = useApp();

  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const formatCurrency = (val) => `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  const handleEdit = (exp) => {
    setEditingExpense(exp);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      deleteExpense(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const clearFilters = () => {
    setFilters({ category: 'all', dateFrom: '', dateTo: '', search: '' });
  };

  const hasActiveFilters = filters.category !== 'all' || filters.dateFrom || filters.dateTo || filters.search;

  // Group expenses by month
  const grouped = filteredExpenses.reduce((acc, exp) => {
    const key = format(parseISO(exp.date), 'MMMM yyyy');
    if (!acc[key]) acc[key] = { label: key, items: [], total: 0 };
    acc[key].items.push(exp);
    acc[key].total += Number(exp.amount);
    return acc;
  }, {});

  return (
    <div className="expense-list-page">
      {/* Search & Filter Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          {filters.search && (
            <button className="clear-btn" onClick={() => setFilters(prev => ({ ...prev, search: '' }))}>
              <X size={14} />
            </button>
          )}
        </div>
        <button
          className={`filter-toggle ${showFilters || hasActiveFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(s => !s)}
        >
          <Filter size={16} />
          Filters
          {hasActiveFilters && <span className="filter-badge" />}
        </button>
        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-row">
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{CATEGORY_ICONS[cat.id]} {cat.label}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={e => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              />
            </div>
            <div className="filter-group">
              <label>To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={e => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="results-info">
        <span>{filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}</span>
        <span className="total-filtered">
          Total: {formatCurrency(filteredExpenses.reduce((s, e) => s + Number(e.amount), 0))}
        </span>
      </div>

      {/* Expense Groups */}
      {filteredExpenses.length === 0 ? (
        <div className="empty-state small">
          <div className="empty-icon">🔍</div>
          <h3>No expenses found</h3>
          <p>Try adjusting your filters or search</p>
        </div>
      ) : (
        Object.values(grouped).map(group => (
          <div key={group.label} className="expense-group">
            <div className="group-header">
              <span className="group-label">{group.label}</span>
              <span className="group-total">{formatCurrency(group.total)}</span>
            </div>
            <div className="expense-cards">
              {group.items.map(exp => {
                const cat = CATEGORIES.find(c => c.id === exp.category);
                return (
                  <div key={exp.id} className="expense-card">
                    <div className="expense-icon" style={{ background: cat?.bg, color: cat?.color }}>
                      {CATEGORY_ICONS[exp.category]}
                    </div>
                    <div className="expense-info">
                      <div className="expense-desc">{exp.description}</div>
                      <div className="expense-meta">
                        <span
                          className="expense-tag"
                          style={{ background: cat?.bg, color: cat?.color }}
                        >
                          {cat?.label}
                        </span>
                        <span className="expense-date">{format(parseISO(exp.date), 'dd MMM yyyy')}</span>
                      </div>
                    </div>
                    <div className="expense-amount">
                      {formatCurrency(exp.amount)}
                    </div>
                    <div className="expense-actions">
                      <button
                        className="action-btn edit"
                        onClick={() => handleEdit(exp)}
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className={`action-btn delete ${deleteConfirm === exp.id ? 'confirm' : ''}`}
                        onClick={() => handleDelete(exp.id)}
                        title={deleteConfirm === exp.id ? 'Click again to confirm' : 'Delete'}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ExpenseList;
