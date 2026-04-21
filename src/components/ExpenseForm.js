import React, { useState, useEffect } from 'react';
import { X, Save, IndianRupee } from 'lucide-react';
import { useApp, CATEGORIES } from '../context/AppContext';

const CATEGORY_ICONS = {
  food: '🍔', travel: '✈️', shopping: '🛍️',
  entertainment: '🎬', health: '💊', utilities: '⚡',
  education: '📚', other: '📌',
};

const ExpenseForm = () => {
  const { addExpense, updateExpense, editingExpense, setShowForm, setEditingExpense } = useApp();

  const [form, setForm] = useState({
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (editingExpense) {
      setForm({
        amount: editingExpense.amount,
        category: editingExpense.category,
        date: editingExpense.date,
        description: editingExpense.description,
      });
    }
  }, [editingExpense]);

  const validate = () => {
    const errs = {};
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      errs.amount = 'Enter a valid amount';
    if (!form.description.trim())
      errs.description = 'Description is required';
    if (!form.date)
      errs.date = 'Date is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (editingExpense) {
      updateExpense(editingExpense.id, form);
    } else {
      addExpense(form);
    }

    handleClose();
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingExpense(null);
    setForm({ amount: '', category: 'food', date: new Date().toISOString().split('T')[0], description: '' });
    setErrors({});
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-card">
        <div className="modal-header">
          <h2>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>
          <button className="icon-btn" onClick={handleClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="expense-form">
          {/* Amount */}
          <div className="form-group">
            <label>Amount</label>
            <div className="input-with-icon">
              <IndianRupee size={16} className="input-icon" />
              <input
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={e => handleChange('amount', e.target.value)}
                className={errors.amount ? 'error' : ''}
              />
            </div>
            {errors.amount && <span className="error-msg">{errors.amount}</span>}
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category</label>
            <div className="category-grid">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-chip ${form.category === cat.id ? 'selected' : ''}`}
                  style={form.category === cat.id ? { borderColor: cat.color, background: cat.bg, color: cat.color } : {}}
                  onClick={() => handleChange('category', cat.id)}
                >
                  <span>{CATEGORY_ICONS[cat.id]}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={e => handleChange('date', e.target.value)}
              className={errors.date ? 'error' : ''}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.date && <span className="error-msg">{errors.date}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              placeholder="What did you spend on?"
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-msg">{errors.description}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>Cancel</button>
            <button type="submit" className="btn-primary">
              <Save size={16} />
              {editingExpense ? 'Update Expense' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
