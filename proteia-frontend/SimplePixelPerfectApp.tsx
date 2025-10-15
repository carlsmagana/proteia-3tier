import React, { useState, useEffect } from 'react';
import { SimplePixelPerfectLogin } from './components/SimplePixelPerfectLogin';
import { MarketOverview } from './components/MarketOverview';
import { CombinedProductComparison } from './components/CombinedProductComparison';
import { ProspectRanking } from './components/ProspectRanking';

export default function SimplePixelPerfectApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('general-data');
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('proteia_token');
      if (token) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('proteia_token');
    localStorage.removeItem('proteia_user');
    setIsAuthenticated(false);
  };

  const tabs = [
    { id: 'general-data', label: 'General Data', icon: '📊', component: MarketOverview },
    { id: 'product-comparison', label: 'Product Comparison', icon: '🔍', component: CombinedProductComparison },
    { id: 'prospects', label: 'Prospectos', icon: '🎯', component: ProspectRanking }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || MarketOverview;

  // Loading Screen
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
            backdropFilter: 'blur(10px)'
          }}>
            <span style={{ fontSize: '32px' }}>🧬</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 16px 0' }}>Proteia</h1>
          <p style={{ fontSize: '16px', opacity: 0.8 }}>Cargando sistema...</p>
        </div>
      </div>
    );
  }

  // Login Screen
  if (!isAuthenticated) {
    return <SimplePixelPerfectLogin onLogin={handleLogin} />;
  }

  // Dashboard Screen
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          .nav-item-hover:hover {
            background-color: rgba(102, 126, 234, 0.1) !important;
            color: #667eea !important;
            transform: translateY(-1px);
          }
          
          .nav-item-active {
            background-color: #667eea !important;
            color: white !important;
            box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);
          }
          
          .card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          }
          
          .button-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
          }
        `}
      </style>
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      }}>
        
        {/* Header */}
        <header style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            
            {/* Logo and Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
              }}>
                <span style={{ fontSize: '24px', lineHeight: '1' }}>🧬</span>
              </div>
              
              <div>
                <h1 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1a202c',
                  margin: 0,
                  letterSpacing: '-0.025em'
                }}>
                  Proteia - Inteligencia Comercial
                </h1>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  Enfoque México — Proteo50 (2025)
                </p>
              </div>
            </div>
            
            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Status Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#059669',
                borderRadius: '50px',
                fontSize: '14px',
                fontWeight: '600',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981'
                }}></div>
                <span>API Conectada</span>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
                  fontFamily: 'inherit'
                }}
                className="button-hover"
              >
                <span>🚪</span>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)'
        }}>
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  background: activeTab === tab.id ? '#667eea' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                  boxShadow: activeTab === tab.id ? '0 4px 14px rgba(102, 126, 234, 0.4)' : 'none'
                }}
                className={activeTab === tab.id ? 'nav-item-active' : 'nav-item-hover'}
              >
                <span style={{ fontSize: '16px', lineHeight: '1' }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '32px 24px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease'
          }}
          className="card-hover">
            <ActiveComponent />
          </div>
        </main>

        {/* Footer */}
        <footer style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(226, 232, 240, 0.6)',
          padding: '32px 0',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              margin: 0,
              fontWeight: '500'
            }}>
              © 2025 Proteia. Sistema de Inteligencia Comercial para el mercado mexicano de proteínas.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
