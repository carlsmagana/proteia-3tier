import React, { useState } from 'react';

interface ProteiaLoginProps {
  onLogin?: () => void;
}

export function ProteiaLogin({ onLogin }: ProteiaLoginProps) {
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
    <div className="min-h-screen flex items-center justify-center" 
         style={{ backgroundColor: 'var(--proteia-bg-secondary)' }}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10"
             style={{ backgroundColor: 'var(--proteia-primary)' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10"
             style={{ backgroundColor: 'var(--proteia-success)' }}></div>
      </div>

      {/* Login Card */}
      <div className="proteia-card relative z-10 w-full max-w-md mx-4">
        <div className="proteia-card-body">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                 style={{ backgroundColor: 'var(--proteia-primary-light)' }}>
              <span className="text-2xl">🧬</span>
            </div>
            <h1 className="proteia-text-3xl proteia-font-bold proteia-text-primary mb-2">
              Proteia
            </h1>
            <p className="proteia-text-sm proteia-text-secondary">
              {isRegisterMode ? 'Crear nueva cuenta' : 'Iniciar sesión en tu cuenta'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg border" 
                   style={{ 
                     backgroundColor: 'var(--proteia-error-light)', 
                     borderColor: 'var(--proteia-error)',
                     color: 'var(--proteia-error)'
                   }}>
                <div className="flex items-center">
                  <span className="mr-2">⚠️</span>
                  <span className="proteia-text-sm proteia-font-medium">{error}</span>
                </div>
              </div>
            )}
            
            {/* Success Message */}
            {success && (
              <div className="p-4 rounded-lg border"
                   style={{ 
                     backgroundColor: 'var(--proteia-success-light)', 
                     borderColor: 'var(--proteia-success)',
                     color: 'var(--proteia-success)'
                   }}>
                <div className="flex items-center">
                  <span className="mr-2">✅</span>
                  <span className="proteia-text-sm proteia-font-medium">{success}</span>
                </div>
              </div>
            )}
            
            {/* Name Field (Register only) */}
            {isRegisterMode && (
              <div>
                <label className="proteia-label">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="proteia-input"
                  required={isRegisterMode}
                  placeholder="Ingresa tu nombre completo"
                />
              </div>
            )}
            
            {/* Email Field */}
            <div>
              <label className="proteia-label">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="proteia-input"
                required
                placeholder="tu@email.com"
              />
            </div>
            
            {/* Password Field */}
            <div>
              <label className="proteia-label">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="proteia-input"
                required
                placeholder={isRegisterMode ? "Mínimo 6 caracteres" : "Tu contraseña"}
              />
            </div>
            
            {/* Confirm Password Field (Register only) */}
            {isRegisterMode && (
              <div>
                <label className="proteia-label">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="proteia-input"
                  required={isRegisterMode}
                  placeholder="Repite tu contraseña"
                />
              </div>
            )}
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`proteia-btn proteia-btn-lg w-full ${
                isRegisterMode ? 'proteia-btn-success' : 'proteia-btn-primary'
              }`}
            >
              <span className="flex items-center justify-center">
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isLoading 
                  ? (isRegisterMode ? 'Registrando...' : 'Iniciando sesión...') 
                  : (isRegisterMode ? '✨ Crear cuenta' : '🚀 Iniciar sesión')
                }
              </span>
            </button>
          </form>
          
          {/* Toggle Mode */}
          <div className="mt-8 text-center">
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
              className="proteia-text-sm proteia-font-medium proteia-transition"
              style={{ color: 'var(--proteia-primary)' }}
            >
              {isRegisterMode 
                ? '¿Ya tienes cuenta? Inicia sesión' 
                : '¿No tienes cuenta? Crear cuenta'
              }
            </button>
          </div>
          
          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center" 
               style={{ borderColor: 'var(--proteia-border-light)' }}>
            <p className="proteia-text-xs proteia-text-muted">
              Sistema de Inteligencia Comercial
            </p>
            <p className="proteia-text-xs proteia-text-muted">
              Análisis del mercado mexicano de proteínas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
