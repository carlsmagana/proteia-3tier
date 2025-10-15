// 🔧 CONFIGURACIÓN DE API PARA PROTEIA FRONTEND

// URLs del backend
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:5018'
  },
  production: {
    baseURL: 'https://proteia-api-dvcegdeaf3execfd.westus2-01.azurewebsites.net'
  }
};

// Detectar entorno automáticamente
const environment = import.meta.env.MODE || 'development';
export const API_BASE_URL = API_CONFIG[environment as keyof typeof API_CONFIG].baseURL;

// Endpoints disponibles
export const API_ENDPOINTS = {
  // Health check
  health: '/health',
  
  // Endpoints básicos (para futuro)
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register'
  },
  products: {
    list: '/api/products',
    details: '/api/products'
  }
};

// Función helper para hacer requests
export const apiRequest = async (endpoint: string, options?: RequestInit) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  // Si la respuesta es texto plano (como nuestro endpoint principal)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return response.text();
  }
};

// Función para verificar que el backend está funcionando
export const checkBackendHealth = async () => {
  try {
    const response = await apiRequest('/health');
    console.log('✅ Backend conectado:', response);
    return true;
  } catch (error) {
    console.error('❌ Error conectando con backend:', error);
    return false;
  }
};
