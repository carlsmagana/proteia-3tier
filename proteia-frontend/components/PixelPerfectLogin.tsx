import React, { useState } from 'react';

interface PixelPerfectLoginProps {
  onLogin?: () => void;
}

export function PixelPerfectLogin({ onLogin }: PixelPerfectLoginProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (isRegisterMode) {
      // Validaciones para registro
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        setIsLoading(false);
        return;
      }
      if (!name.trim()) {
        setError('El nombre es requerido');
        setIsLoading(false);
        return;
      }
    }

    try {
      const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
      const body = isRegisterMode 
        ? { name, email, password }
        : { email, password };
      
      const response = await fetch(`http://localhost:5018${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (isRegisterMode) {
          setSuccess('¡Usuario registrado exitosamente! Ahora puedes iniciar sesión.');
          setIsRegisterMode(false);
          setName('');
          setPassword('');
          setConfirmPassword('');
          setEmail('');
        } else {
          localStorage.setItem('proteia_token', data.token);
          localStorage.setItem('proteia_user', JSON.stringify(data));
          onLogin?.();
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || (isRegisterMode ? 'Error en el registro' : 'Credenciales inválidas'));
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: 'var(--pp-bg-secondary)' }}
    >
      {/* Background Pattern - Pixel Perfect */}
      <div className="absolute inset-0">
        <div 
          className="absolute opacity-5"
          style={{
            top: '-160px',
            right: '-160px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            backgroundColor: 'var(--pp-primary-600)'
          }}
        ></div>
        <div 
          className="absolute opacity-5"
          style={{
            bottom: '-160px',
            left: '-160px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            backgroundColor: 'var(--pp-success-600)'
          }}
        ></div>
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-2"
          style={{
            backgroundImage: `
              linear-gradient(var(--pp-gray-200) 1px, transparent 1px),
              linear-gradient(90deg, var(--pp-gray-200) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px'
          }}
        ></div>
      </div>

      {/* Login Card - Pixel Perfect */}
      <div 
        className="pp-card relative z-10 w-full mx-auto"
        style={{ 
          maxWidth: '440px',
          margin: '0 var(--pp-space-6)'
        }}
      >
        <div className="pp-card-body-lg">
          
          {/* Header - Pixel Perfect */}
          <div className="text-center" style={{ marginBottom: 'var(--pp-space-10)' }}>
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
              <span 
                style={{ 
                  fontSize: '32px',
                  lineHeight: '1'
                }}
              >
                🧬
              </span>
            </div>
            
            <h1 
              className="pp-text-4xl pp-font-bold pp-text-primary"
              style={{ 
                margin: '0 0 var(--pp-space-3) 0',
                letterSpacing: '-0.025em'
              }}
            >
              Proteia
            </h1>
            
            <p 
              className="pp-text-base pp-text-secondary"
              style={{ margin: 0 }}
            >
              {isRegisterMode ? 'Crear nueva cuenta' : 'Iniciar sesión en tu cuenta'}
            </p>
          </div>

          {/* Form - Pixel Perfect */}
          <form onSubmit={handleSubmit}>
            
            {/* Error Alert - Pixel Perfect */}
            {error && (
              <div 
                className="pp-alert pp-alert-error"
                style={{ marginBottom: 'var(--pp-space-6)' }}
              >
                <span style={{ fontSize: 'var(--pp-text-base)', lineHeight: '1' }}>⚠️</span>
                <span className="pp-text-sm pp-font-medium">{error}</span>
              </div>
            )}
            
            {/* Success Alert - Pixel Perfect */}
            {success && (
              <div 
                className="pp-alert pp-alert-success"
                style={{ marginBottom: 'var(--pp-space-6)' }}
              >
                <span style={{ fontSize: 'var(--pp-text-base)', lineHeight: '1' }}>✅</span>
                <span className="pp-text-sm pp-font-medium">{success}</span>
              </div>
            )}
            
            {/* Form Fields Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--pp-space-5)' }}>
              
              {/* Name Field (Register only) - Pixel Perfect */}
              {isRegisterMode && (
                <div>
                  <label className="pp-label pp-label-required">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pp-input pp-input-lg"
                    required={isRegisterMode}
                    placeholder="Ingresa tu nombre completo"
                  />
                </div>
              )}
              
              {/* Email Field - Pixel Perfect */}
              <div>
                <label className="pp-label pp-label-required">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pp-input pp-input-lg"
                  required
                  placeholder="tu@email.com"
                />
              </div>
              
              {/* Password Field - Pixel Perfect */}
              <div>
                <label className="pp-label pp-label-required">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pp-input pp-input-lg"
                  required
                  placeholder={isRegisterMode ? "Mínimo 6 caracteres" : "Tu contraseña"}
                />
              </div>
              
              {/* Confirm Password Field (Register only) - Pixel Perfect */}
              {isRegisterMode && (
                <div>
                  <label className="pp-label pp-label-required">
                    Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pp-input pp-input-lg"
                    required={isRegisterMode}
                    placeholder="Repite tu contraseña"
                  />
                </div>
              )}
            </div>
            
            {/* Submit Button - Pixel Perfect */}
            <div style={{ marginTop: 'var(--pp-space-8)' }}>
              <button
                type="submit"
                disabled={isLoading}
                className={`pp-btn pp-btn-lg ${
                  isRegisterMode ? 'pp-btn-success' : 'pp-btn-primary'
                }`}
                style={{ width: '100%' }}
              >
                {isLoading && (
                  <div className="pp-spinner" style={{ marginRight: 'var(--pp-space-3)' }}></div>
                )}
                <span>
                  {isLoading 
                    ? (isRegisterMode ? 'Registrando...' : 'Iniciando sesión...') 
                    : (isRegisterMode ? '✨ Crear cuenta' : '🚀 Iniciar sesión')
                  }
                </span>
              </button>
            </div>
          </form>
          
          {/* Toggle Mode - Pixel Perfect */}
          <div 
            className="text-center"
            style={{ marginTop: 'var(--pp-space-8)' }}
          >
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError('');
                setSuccess('');
                setName('');
                setPassword('');
                setConfirmPassword('');
                setEmail('');
              }}
              className="pp-btn pp-btn-ghost pp-btn-sm pp-transition"
            >
              {isRegisterMode 
                ? '¿Ya tienes cuenta? Inicia sesión' 
                : '¿No tienes cuenta? Crear cuenta'
              }
            </button>
          </div>
          
          {/* Footer - Pixel Perfect */}
          <div 
            className="text-center"
            style={{ 
              marginTop: 'var(--pp-space-10)',
              paddingTop: 'var(--pp-space-6)',
              borderTop: `var(--pp-border-width-1) solid var(--pp-gray-200)`
            }}
          >
            <p 
              className="pp-text-xs pp-text-tertiary"
              style={{ margin: '0 0 var(--pp-space-1) 0' }}
            >
              Sistema de Inteligencia Comercial
            </p>
            <p 
              className="pp-text-xs pp-text-tertiary"
              style={{ margin: 0 }}
            >
              Análisis del mercado mexicano de proteínas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
