import React, { useState, useEffect } from 'react';
import { PixelPerfectLogin } from './components/PixelPerfectLogin';
import { PixelPerfectDashboard } from './components/PixelPerfectDashboard';

export default function PixelPerfectApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('proteia_token');
      const user = localStorage.getItem('proteia_user');
      
      if (token && user) {
        try {
          const userData = JSON.parse(user);
          // Verificar que el token no esté expirado
          const now = new Date().getTime();
          const expiresAt = new Date(userData.expiresAt).getTime();
          
          if (now < expiresAt) {
            setIsAuthenticated(true);
          } else {
            // Token expirado, limpiar storage
            localStorage.removeItem('proteia_token');
            localStorage.removeItem('proteia_user');
            setIsAuthenticated(false);
          }
        } catch (error) {
          // Error al parsear, limpiar storage
          localStorage.removeItem('proteia_token');
          localStorage.removeItem('proteia_user');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
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

  // Loading Screen - Pixel Perfect
  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--pp-bg-secondary)' }}
      >
        <div className="text-center">
          <div 
            className="inline-flex items-center justify-center mx-auto"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'var(--pp-primary-50)',
              marginBottom: 'var(--pp-space-6)'
            }}
          >
            <span style={{ fontSize: '32px', lineHeight: '1' }}>🧬</span>
          </div>
          
          <h1 
            className="pp-text-3xl pp-font-bold pp-text-primary"
            style={{ 
              margin: '0 0 var(--pp-space-4) 0',
              letterSpacing: '-0.025em'
            }}
          >
            Proteia
          </h1>
          
          <div className="flex items-center justify-center" style={{ gap: 'var(--pp-space-3)' }}>
            <div className="pp-spinner"></div>
            <span className="pp-text-base pp-text-secondary">Cargando sistema...</span>
          </div>
        </div>
      </div>
    );
  }

  // Render Login or Dashboard
  if (!isAuthenticated) {
    return <PixelPerfectLogin onLogin={handleLogin} />;
  }

  return <PixelPerfectDashboard onLogout={handleLogout} />;
}
