import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Building2, Lock, User, ChevronRight } from 'lucide-react';
// Temporalmente comentamos el useAuth para debuggear
// import { useAuth } from '../figma/src/contexts/AuthContext';

interface LoginProps {
  onLogin?: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('carlos@x-world.us');
  const [password, setPassword] = useState('@Bravenewworld2');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Intentando login con:', { email, password });
      
      const response = await fetch('http://localhost:5018/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Login exitoso:', data);
        
        // Guardar token en localStorage
        localStorage.setItem('proteia_token', data.token);
        localStorage.setItem('proteia_user', JSON.stringify(data));
        
        onLogin?.();
      } else {
        const errorData = await response.json();
        console.log('Login fallido:', errorData);
        setError(errorData.message || 'Credenciales inválidas');
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      {/* Header */}
      <header className="border-b border-white/20 bg-white/70 backdrop-blur-md relative z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Proteo Biotech
                </h1>
                <p className="text-sm text-gray-600">Inteligencia Comercial</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 font-medium">
              Sistema Avanzado de Análisis
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              Bienvenido a Proteo
            </h2>
            <p className="text-gray-600 text-lg">
              Plataforma de Inteligencia Comercial
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Análisis avanzado del mercado mexicano
            </p>
          </div>

          {/* Login Card */}
          <Card className="border border-white/20 shadow-2xl bg-white/90 backdrop-blur-md">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">Iniciar Sesión</CardTitle>
              <CardDescription className="text-gray-600">
                Ingrese sus credenciales para acceder al sistema
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="bg-red-50 border-red-200">
                    <Lock className="h-4 w-4" />
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Ingrese su email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Ingrese su contraseña"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verificando credenciales...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Acceder al Sistema
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info Section */}
          <div className="mt-8 text-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Sistema de Inteligencia Comercial — Enfoque México
              </p>
              <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Proteo50</span>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Protein Solutions</span>
                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">Market Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-6 text-center text-sm text-gray-500 bg-white/40 backdrop-blur-sm border-t border-white/20 relative z-10">
        <p>© 2025 Proteo Biotech. Plataforma de Inteligencia Comercial.</p>
        <p className="text-xs text-gray-400 mt-1">Desarrollado para análisis del mercado mexicano</p>
      </footer>
    </div>
  );
}