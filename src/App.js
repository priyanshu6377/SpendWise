import React, { useState, useCallback } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ExpenseList from './components/ExpenseList';
import IncomeList from './components/IncomeList';
import Charts from './components/Charts';
import Settings from './components/Settings';
import ExpenseForm from './components/ExpenseForm';
import IncomeForm from './components/IncomeForm';
import MobileNav from './components/MobileNav';
import SplashScreen from './components/SplashScreen';
import './App.css';

const AppContent = () => {
  const { activeTab, showForm, showIncomeForm } = useApp();

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'expenses': return <ExpenseList />;
      case 'income': return <IncomeList />;
      case 'charts': return <Charts />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <div className="page-container">
          {renderPage()}
        </div>
      </main>
      <MobileNav />
      {showForm && <ExpenseForm />}
      {showIncomeForm && <IncomeForm />}
    </div>
  );
};

function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);

  return (
    <AppProvider>
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}
      {splashDone && <AppContent />}
    </AppProvider>
  );
}

export default App;
