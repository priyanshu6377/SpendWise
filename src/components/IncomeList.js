import React, { useState } from 'react';
import { Search, Edit2, Trash2, X, TrendingUp } from 'lucide-react';
import { useApp, INCOME_CATEGORIES } from '../context/AppContext';
import { format, parseISO } from 'date-fns';

const INC_ICONS = { salary:'💼',freelance:'💻',business:'🏢',investment:'📈',rental:'🏠',gift:'🎁',refund:'↩️',other:'💵' };

const IncomeList = () => {
  const { incomes, deleteIncome, setShowIncomeForm, setEditingIncome } = useApp();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const formatCurrency = (val) => `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  const filtered = incomes.filter(i => {
    const matchCat = catFilter === 'all' || i.category === catFilter;
    const matchSearch = !search || i.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const grouped = filtered.reduce((acc, inc) => {
    const key = format(parseISO(inc.date), 'MMMM yyyy');
    if (!acc[key]) acc[key] = { label: key, items: [], total: 0 };
    acc[key].items.push(inc);
    acc[key].total += Number(inc.amount);
    return acc;
  }, {});

  const handleDelete = (id) => {
    if (deleteConfirm === id) { deleteIncome(id); setDeleteConfirm(null); }
    else { setDeleteConfirm(id); setTimeout(() => setDeleteConfirm(null), 3000); }
  };

  const totalFiltered = filtered.reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div className="expense-list-page">
      <div className="income-page-header">
        <div>
          <h2 className="income-title">Income Tracker</h2>
          <p className="income-subtitle">All your income sources in one place</p>
        </div>
        <button className="btn-success" onClick={() => { setEditingIncome(null); setShowIncomeForm(true); }}>
          <TrendingUp size={16} /> Add Income
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search income..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="clear-btn" onClick={() => setSearch('')}><X size={14}/></button>}
        </div>
        <select
          className="cat-select"
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
        >
          <option value="all">All Sources</option>
          {INCOME_CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{INC_ICONS[c.id]} {c.label}</option>
          ))}
        </select>
      </div>

      <div className="results-info">
        <span>{filtered.length} income entr{filtered.length !== 1 ? 'ies' : 'y'}</span>
        <span className="total-filtered income-total">Total: {formatCurrency(totalFiltered)}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state small">
          <div className="empty-icon">💰</div>
          <h3>No income entries found</h3>
          <p>Add your first income entry to get started</p>
          <button className="btn-success" style={{marginTop:8}} onClick={() => { setEditingIncome(null); setShowIncomeForm(true); }}>
            <TrendingUp size={16} /> Add Income
          </button>
        </div>
      ) : (
        Object.values(grouped).map(group => (
          <div key={group.label} className="expense-group">
            <div className="group-header">
              <span className="group-label">{group.label}</span>
              <span className="group-total income-group-total">+{formatCurrency(group.total)}</span>
            </div>
            <div className="expense-cards">
              {group.items.map(inc => {
                const cat = INCOME_CATEGORIES.find(c => c.id === inc.category);
                return (
                  <div key={inc.id} className="expense-card income-card">
                    <div className="expense-icon" style={{ background: cat?.bg, color: cat?.color }}>
                      {INC_ICONS[inc.category]}
                    </div>
                    <div className="expense-info">
                      <div className="expense-desc">{inc.description}</div>
                      <div className="expense-meta">
                        <span className="expense-tag income-tag" style={{ background: cat?.bg, color: cat?.color }}>
                          {cat?.label}
                        </span>
                        <span className="expense-date">{format(parseISO(inc.date), 'dd MMM yyyy')}</span>
                      </div>
                    </div>
                    <div className="expense-amount income-amount">
                      +{formatCurrency(inc.amount)}
                    </div>
                    <div className="expense-actions">
                      <button className="action-btn edit" onClick={() => { setEditingIncome(inc); setShowIncomeForm(true); }} title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button
                        className={`action-btn delete ${deleteConfirm === inc.id ? 'confirm' : ''}`}
                        onClick={() => handleDelete(inc.id)}
                        title={deleteConfirm === inc.id ? 'Click again to confirm' : 'Delete'}
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

export default IncomeList;
