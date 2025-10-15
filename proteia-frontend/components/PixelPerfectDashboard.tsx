import React, { useState } from 'react';
import { MarketOverview } from './MarketOverview';
import { CombinedProductComparison } from './CombinedProductComparison';
import { ProspectRanking } from './ProspectRanking';

interface PixelPerfectDashboardProps {
  onLogout: () => void;
}

export function PixelPerfectDashboard({ onLogout }: PixelPerfectDashboardProps) {
  const [activeTab, setActiveTab] = useState('general-data');

  const tabs = [
    { 
      id: 'general-data', 
      label: 'General Data', 
      icon: '📊',
      component: MarketOverview
    },
    { 
      id: 'product-comparison', 
      label: 'Product Comparison', 
      icon: '🔍',
      component: CombinedProductComparison
    },
    { 
      id: 'prospects', 
      label: 'Prospectos', 
      icon: '🎯',
      component: ProspectRanking
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || MarketOverview;

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: 'var(--pp-bg-secondary)' }}
    >
      {/* Header - Pixel Perfect */}
      <header className="pp-header">
        <div className="pp-container">
          <div className="pp-header-content">
            {/* Logo and Title */}
            <div className="flex items-center" style={{ gap: 'var(--pp-space-4)' }}>
              <div 
                className="flex items-center justify-center"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--pp-primary-50)'
                }}
              >
                <span style={{ fontSize: '24px', lineHeight: '1' }}>🧬</span>
              </div>
              
              <div>
                <h1 
                  className="pp-text-xl pp-font-bold pp-text-primary"
                  style={{ margin: 0, lineHeight: 'var(--pp-leading-xl)' }}
                >
                  Proteia - Inteligencia Comercial
                </h1>
                <p 
                  className="pp-text-sm pp-text-secondary"
                  style={{ margin: 0, lineHeight: 'var(--pp-leading-sm)' }}
                >
                  Enfoque México — Proteo50 (2025)
                </p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center" style={{ gap: 'var(--pp-space-4)' }}>
              {/* Status Badge */}
              <div className="pp-badge pp-badge-success">
                <div 
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--pp-success-600)'
                  }}
                ></div>
                <span>API Conectada</span>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="pp-btn pp-btn-sm pp-btn-error"
              >
                <span>🚪</span>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation - Pixel Perfect */}
      <nav className="pp-nav">
        <div className="pp-container">
          <div className="pp-nav-content">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pp-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              >
                <span style={{ fontSize: 'var(--pp-text-base)', lineHeight: '1' }}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content - Pixel Perfect */}
      <main 
        className="pp-container"
        style={{ 
          paddingTop: 'var(--pp-space-8)',
          paddingBottom: 'var(--pp-space-8)'
        }}
      >
        <div className="pp-card">
          <div className="pp-card-body-lg">
            <ActiveComponent />
          </div>
        </div>
      </main>

      {/* Footer - Pixel Perfect */}
      <footer 
        className="text-center pp-bg-primary"
        style={{ 
          padding: 'var(--pp-space-8) 0',
          borderTop: `var(--pp-border-width-1) solid var(--pp-gray-200)`
        }}
      >
        <div className="pp-container">
          <p className="pp-text-sm pp-text-tertiary" style={{ margin: 0 }}>
            © 2025 Proteia. Sistema de Inteligencia Comercial para el mercado mexicano de proteínas.
          </p>
        </div>
      </footer>
    </div>
  );
}
