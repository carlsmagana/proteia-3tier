#!/bin/bash

# 🛑 Script para detener Proteia 3-Tier System
# Este script detiene todas las capas del sistema

echo "🛑 Deteniendo Proteia 3-Tier System..."
echo "====================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Detener Frontend
print_status "🎨 Deteniendo Frontend..."
if [ -f "proteia-frontend/frontend.pid" ]; then
    FRONTEND_PID=$(cat proteia-frontend/frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        rm proteia-frontend/frontend.pid
        print_success "Frontend detenido (PID: $FRONTEND_PID)"
    else
        print_warning "Frontend ya estaba detenido"
        rm -f proteia-frontend/frontend.pid
    fi
else
    # Buscar proceso por puerto
    FRONTEND_PID=$(lsof -ti :3000)
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID
        print_success "Frontend detenido (PID: $FRONTEND_PID)"
    else
        print_warning "Frontend no estaba corriendo"
    fi
fi

# Detener Backend
print_status "🔧 Deteniendo Backend..."
if [ -f "proteia-backend/backend.pid" ]; then
    BACKEND_PID=$(cat proteia-backend/backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        rm proteia-backend/backend.pid
        print_success "Backend detenido (PID: $BACKEND_PID)"
    else
        print_warning "Backend ya estaba detenido"
        rm -f proteia-backend/backend.pid
    fi
else
    # Buscar proceso por puerto
    BACKEND_PID=$(lsof -ti :5018)
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID
        print_success "Backend detenido (PID: $BACKEND_PID)"
    else
        print_warning "Backend no estaba corriendo"
    fi
fi

# Limpiar archivos de log si se desea
read -p "¿Deseas limpiar los archivos de log? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f proteia-backend/backend.log
    rm -f proteia-frontend/frontend.log
    print_success "Archivos de log eliminados"
fi

echo ""
print_success "🎉 Proteia 3-Tier System detenido completamente"
echo ""
print_status "Para reiniciar el sistema, ejecuta:"
echo "  ./start-all.sh"
