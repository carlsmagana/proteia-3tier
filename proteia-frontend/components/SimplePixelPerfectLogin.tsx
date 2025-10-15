import React, { useState } from 'react';

interface SimplePixelPerfectLoginProps {
  onLogin?: () => void;
}

export function SimplePixelPerfectLogin({ onLogin }: SimplePixelPerfectLoginProps) {
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

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: 'relative',
    overflow: 'hidden'
  };

  const backgroundPatternStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)
    `,
    zIndex: 1
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '48px',
    width: '100%',
    maxWidth: '480px',
    margin: '24px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)',
    position: 'relative',
    zIndex: 2,
    border: '1px solid rgba(255, 255, 255, 0.2)'
  };

  const logoContainerStyle: React.CSSProperties = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 32px auto',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '36px',
    fontWeight: '700',
    color: '#1a202c',
    textAlign: 'center',
    margin: '0 0 8px 0',
    letterSpacing: '-0.025em'
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#64748b',
    textAlign: 'center',
    margin: '0 0 40px 0',
    fontWeight: '400'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '56px',
    padding: '16px 20px',
    fontSize: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    background: '#ffffff',
    color: '#1a202c',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
    outline: 'none'
  };

  const inputFocusStyle: React.CSSProperties = {
    ...inputStyle,
    borderColor: '#667eea',
    boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    height: '56px',
    background: isRegisterMode 
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
    fontFamily: 'inherit',
    opacity: isLoading ? 0.7 : 1
  };

  const alertStyle: React.CSSProperties = {
    padding: '16px 20px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const errorAlertStyle: React.CSSProperties = {
    ...alertStyle,
    background: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca'
  };

  const successAlertStyle: React.CSSProperties = {
    ...alertStyle,
    background: '#f0fdf4',
    color: '#059669',
    border: '1px solid #bbf7d0'
  };

  const toggleButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#667eea',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontFamily: 'inherit',
    padding: '8px 0'
  };

  const spinnerStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    borderTopColor: '#ffffff',
    animation: 'spin 1s linear infinite'
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          .input-focus:focus {
            border-color: #667eea !important;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1) !important;
          }
          
          .button-hover:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
          }
        `}
      </style>
      
      <div style={containerStyle}>
        <div style={backgroundPatternStyle}></div>
        
        <div style={cardStyle}>
          {/* Header */}
          <div style={logoContainerStyle}>
            <span style={{ fontSize: '32px', lineHeight: '1' }}>🧬</span>
          </div>
          
          <h1 style={titleStyle}>Proteia</h1>
          <p style={subtitleStyle}>
            {isRegisterMode ? 'Crear nueva cuenta' : 'Iniciar sesión en tu cuenta'}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Error Alert */}
            {error && (
              <div style={errorAlertStyle}>
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}
            
            {/* Success Alert */}
            {success && (
              <div style={successAlertStyle}>
                <span>✅</span>
                <span>{success}</span>
              </div>
            )}
            
            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Name Field (Register only) */}
              {isRegisterMode && (
                <div>
                  <label style={labelStyle}>Nombre completo *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                    className="input-focus"
                    required={isRegisterMode}
                    placeholder="Ingresa tu nombre completo"
                  />
                </div>
              )}
              
              {/* Email Field */}
              <div>
                <label style={labelStyle}>Correo electrónico *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  className="input-focus"
                  required
                  placeholder="tu@email.com"
                />
              </div>
              
              {/* Password Field */}
              <div>
                <label style={labelStyle}>Contraseña *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                  className="input-focus"
                  required
                  placeholder={isRegisterMode ? "Mínimo 6 caracteres" : "Tu contraseña"}
                />
              </div>
              
              {/* Confirm Password Field (Register only) */}
              {isRegisterMode && (
                <div>
                  <label style={labelStyle}>Confirmar contraseña *</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={inputStyle}
                    className="input-focus"
                    required={isRegisterMode}
                    placeholder="Repite tu contraseña"
                  />
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div style={{ marginTop: '32px' }}>
              <button
                type="submit"
                disabled={isLoading}
                style={buttonStyle}
                className="button-hover"
              >
                {isLoading && <div style={spinnerStyle}></div>}
                <span>
                  {isLoading 
                    ? (isRegisterMode ? 'Registrando...' : 'Iniciando sesión...') 
                    : (isRegisterMode ? '✨ Crear cuenta' : '🚀 Iniciar sesión')
                  }
                </span>
              </button>
            </div>
          </form>
          
          {/* Toggle Mode */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
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
              style={toggleButtonStyle}
            >
              {isRegisterMode 
                ? '¿Ya tienes cuenta? Inicia sesión' 
                : '¿No tienes cuenta? Crear cuenta'
              }
            </button>
          </div>
          
          {/* Footer */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '40px', 
            paddingTop: '24px', 
            borderTop: '1px solid #e2e8f0' 
          }}>
            <p style={{ 
              fontSize: '12px', 
              color: '#64748b', 
              margin: '0 0 4px 0' 
            }}>
              Sistema de Inteligencia Comercial
            </p>
            <p style={{ 
              fontSize: '12px', 
              color: '#64748b', 
              margin: 0 
            }}>
              Análisis del mercado mexicano de proteínas
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
