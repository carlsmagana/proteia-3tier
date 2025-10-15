import React, { useState } from 'react';
import { ProteiaLogin } from './components/ProteiaLogin';
import { MarketOverview } from './components/MarketOverview';
import { CombinedProductComparison } from './components/CombinedProductComparison';
import { ProspectRanking } from './components/ProspectRanking';

export default function SimpleApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('general-data');

  // Verificar si hay token en localStorage al cargar
  React.useEffect(() => {
    const token = localStorage.getItem('proteia_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('proteia_token');
    localStorage.removeItem('proteia_user');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <ProteiaLogin onLogin={handleLogin} />;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--proteia-bg-secondary)',
      padding: 'var(--proteia-space-8)'
    }}>
      {/* Header */}
      <header className="proteia-card mb-8">
        <div className="proteia-card-body flex justify-between items-center">
          <div>
            <h1 className="proteia-text-2xl proteia-font-bold proteia-text-primary m-0 flex items-center gap-3">
              <span className="text-3xl">🧬</span>
              Proteia - Inteligencia Comercial
            </h1>
            <p className="proteia-text-sm proteia-text-secondary mt-1 mb-0">
              Enfoque México — Proteo50 (2025)
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ 
                    backgroundColor: 'var(--proteia-success-light)', 
                    color: 'var(--proteia-success)' 
                  }}>
              <span className="w-2 h-2 rounded-full mr-2" 
                    style={{ backgroundColor: 'var(--proteia-success)' }}></span>
              API Conectada
            </span>
            
            <button
              onClick={handleLogout}
              className="proteia-btn proteia-btn-sm"
              style={{
                backgroundColor: 'var(--proteia-error)',
                color: 'var(--proteia-text-inverse)'
              }}
            >
              <span>🚪</span>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>
      {/* Navigation Tabs */}
      <nav className="proteia-card mb-8">
        <div className="proteia-card-body">
          <div className="flex gap-2">
            {[
              { id: 'general-data', label: 'General Data', icon: ' ' },
              { id: 'product-comparison', label: 'Product Comparison', icon: ' ' },
              { id: 'prospects', label: 'Prospectos', icon: ' ' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`proteia-btn proteia-btn-md proteia-transition ${
                  activeTab === tab.id ? 'proteia-btn-primary' : 'proteia-btn-secondary'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{tab.icon}</span>
                  {tab.label.replace(/^[^\s]+ /, '')}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        {activeTab === 'general-data' && <MarketOverview />}
        {activeTab === 'product-comparison' && <CombinedProductComparison />}
        {activeTab === 'prospects' && <ProspectRanking />}
      </main>
    </div>
  );
}
