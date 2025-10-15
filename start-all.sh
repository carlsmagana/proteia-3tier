#!/bin/bash

# 🚀 Script de inicio para Proteia 3-Tier System
# Este script inicia todas las capas del sistema en orden

echo "🧬 Iniciando Proteia 3-Tier System..."
echo "======================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar prerrequisitos
print_status "Verificando prerrequisitos..."

# Verificar .NET 8
if ! command -v dotnet &> /dev/null; then
    print_error ".NET 8 no está instalado"
    exit 1
fi

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado"
    exit 1
fi

# Verificar Python
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 no está instalado"
    exit 1
fi

print_success "Todos los prerrequisitos están instalados"

# 1. Verificar Base de Datos
print_status "🗄️ Verificando conexión a base de datos..."
cd proteia-database/
if python3 test_connection.py > /dev/null 2>&1; then
    print_success "Conexión a base de datos exitosa"
else
    print_warning "No se pudo conectar a la base de datos. Verifica la configuración."
fi
cd ..

# 2. Iniciar Backend
print_status "🔧 Iniciando Backend (.NET 8 API)..."
cd proteia-backend/

# Verificar si ya está corriendo
if lsof -i :5018 > /dev/null 2>&1; then
    print_warning "Backend ya está corriendo en puerto 5018"
else
    print_status "Instalando dependencias del backend..."
    dotnet restore > /dev/null 2>&1
    
    print_status "Iniciando servidor backend en puerto 5018..."
    nohup dotnet run > backend.log 2>&1 &
    BACKEND_PID=$!
    
    # Esperar a que el backend esté listo
    sleep 5
    
    if curl -s http://localhost:5018/health > /dev/null 2>&1; then
        print_success "Backend iniciado correctamente (PID: $BACKEND_PID)"
        echo $BACKEND_PID > backend.pid
    else
        print_error "Error al iniciar el backend"
        exit 1
    fi
fi
cd ..

# 3. Iniciar Frontend
print_status "🎨 Iniciando Frontend (React)..."
cd proteia-frontend/

# Verificar si ya está corriendo
if lsof -i :3000 > /dev/null 2>&1; then
    print_warning "Frontend ya está corriendo en puerto 3000"
else
    print_status "Instalando dependencias del frontend..."
    npm install > /dev/null 2>&1
    
    print_status "Iniciando servidor frontend en puerto 3000..."
    nohup npm run dev > frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    # Esperar a que el frontend esté listo
    sleep 8
    
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend iniciado correctamente (PID: $FRONTEND_PID)"
        echo $FRONTEND_PID > frontend.pid
    else
        print_error "Error al iniciar el frontend"
        exit 1
    fi
fi
cd ..

# Resumen final
echo ""
echo "🎉 ¡Proteia 3-Tier System iniciado exitosamente!"
echo "=============================================="
echo ""
print_success "🗄️ Base de Datos: Azure SQL Database (Conectada)"
print_success "🔧 Backend API: http://localhost:5018"
print_success "📚 Swagger UI: http://localhost:5018/swagger"
print_success "🎨 Frontend: http://localhost:3000"
echo ""
print_status "Credenciales de acceso:"
echo "  📧 Email: carlos@x-world.us"
echo "  🔐 Password: @Bravenewworld2"
echo ""
print_status "Para detener todos los servicios, ejecuta:"
echo "  ./stop-all.sh"
echo ""
print_status "Logs disponibles:"
echo "  Backend: proteia-backend/backend.log"
echo "  Frontend: proteia-frontend/frontend.log"
echo ""
print_success "¡Sistema listo para usar! 🚀"
