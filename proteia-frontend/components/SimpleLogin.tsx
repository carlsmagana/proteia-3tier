import React, { useState } from 'react';

interface SimpleLoginProps {
  onLogin?: () => void;
}

export function SimpleLogin({ onLogin }: SimpleLoginProps) {
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

    console.log(isRegisterMode ? '🚀 Iniciando registro...' : '🚀 Iniciando login...');
    console.log('📧 Email:', email);
    console.log('🔐 Password:', password);
    if (isRegisterMode) console.log('👤 Name:', name);

    try {
      console.log('📡 Enviando request a API...');
      
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

      console.log('📥 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log(isRegisterMode ? '✅ Registro exitoso!' : '✅ Login exitoso!', data);
        
        if (isRegisterMode) {
          setSuccess('¡Usuario registrado exitosamente! Ahora puedes iniciar sesión.');
          setIsRegisterMode(false);
          setName('');
          setPassword('');
          setConfirmPassword('');
          setEmail('');
        } else {
          // Guardar token en localStorage
          localStorage.setItem('proteia_token', data.token);
          localStorage.setItem('proteia_user', JSON.stringify(data));
          
          alert('¡Login exitoso! Redirigiendo...');
          onLogin?.();
        }
      } else {
        const errorData = await response.json();
        console.log('❌ Operación fallida:', errorData);
        setError(errorData.message || (isRegisterMode ? 'Error en el registro' : 'Credenciales inválidas'));
      }
    } catch (err) {
      console.error('💥 Error de conexión:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
      console.log('🏁 Process finished');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f0f9ff'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '400px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1f2937' }}>
          🧬 Proteia {isRegisterMode ? 'Registro' : 'Login'}
        </h1>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={{
              backgroundColor: '#d1fae5',
              color: '#065f46',
              padding: '0.75rem',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              {success}
            </div>
          )}
          
          {isRegisterMode && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Nombre completo:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                required={isRegisterMode}
                placeholder="Ingresa tu nombre completo"
              />
            </div>
          )}
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              required
              placeholder="tu@email.com"
            />
          </div>
          
          <div style={{ marginBottom: isRegisterMode ? '1rem' : '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Contraseña:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              required
              placeholder={isRegisterMode ? "Mínimo 6 caracteres" : "Tu contraseña"}
            />
          </div>
          
          {isRegisterMode && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Confirmar contraseña:
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                required={isRegisterMode}
                placeholder="Repite tu contraseña"
              />
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: isLoading ? '#9ca3af' : (isRegisterMode ? '#10b981' : '#3b82f6'),
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginBottom: '1rem'
            }}
          >
            {isLoading 
              ? (isRegisterMode ? '🔄 Registrando...' : '🔄 Iniciando sesión...') 
              : (isRegisterMode ? '✅ Registrarse' : '🚀 Iniciar Sesión')
            }
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
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
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            {isRegisterMode 
              ? '¿Ya tienes cuenta? Inicia sesión' 
              : '¿No tienes cuenta? Regístrate'
            }
          </button>
        </div>
      </div>
    </div>
  );
}
