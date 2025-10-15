#!/usr/bin/env python3
"""
Script para probar la conexión a Azure SQL Database
Configurado para: xworld-proteo.database.windows.net/proteo
"""

import pyodbc
import sys
from connection_config import DATABASE_CONFIG, get_direct_connection_string

def test_azure_sql_connection():
    print("🔍 Probando conexión a Azure SQL Database")
    print("=" * 50)
    print(f"🌐 Servidor: {DATABASE_CONFIG['server']}")
    print(f"🗄️  Base de datos: {DATABASE_CONFIG['database']}")
    print("=" * 50)
    
    # Solicitar credenciales
    username = input("\n👤 Usuario SQL: ").strip()
    password = input("🔐 Contraseña: ").strip()
    
    if not username or not password:
        print("❌ Usuario y contraseña son requeridos")
        return False
    
    try:
        print("\n🔄 Conectando...")
        
        # Construir cadena de conexión
        conn_str = get_direct_connection_string(username, password)
        
        # Intentar conexión
        with pyodbc.connect(conn_str) as conn:
            cursor = conn.cursor()
            
            # Probar consulta básica
            cursor.execute("SELECT @@VERSION as SqlVersion, DB_NAME() as DatabaseName, GETDATE() as CurrentTime")
            result = cursor.fetchone()
            
            print("✅ ¡Conexión exitosa!")
            print(f"📊 Base de datos: {result.DatabaseName}")
            print(f"🕐 Hora del servidor: {result.CurrentTime}")
            print(f"🔧 Versión SQL: {result.SqlVersion[:50]}...")
            
            # Verificar si existe config.users
            cursor.execute("""
                SELECT COUNT(*) as TableExists 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_SCHEMA = 'config' AND TABLE_NAME = 'users'
            """)
            
            table_exists = cursor.fetchone().TableExists
            if table_exists:
                print("✅ Tabla config.users encontrada")
                
                # Contar usuarios existentes
                cursor.execute("SELECT COUNT(*) as UserCount FROM config.users")
                user_count = cursor.fetchone().UserCount
                print(f"👥 Usuarios existentes: {user_count}")
            else:
                print("⚠️  Tabla config.users no encontrada")
                print("   Será necesario crearla antes de la importación")
            
            return True
            
    except pyodbc.Error as e:
        print(f"❌ Error de conexión: {e}")
        
        # Diagnóstico de errores comunes
        error_msg = str(e).lower()
        
        if "login failed" in error_msg:
            print("\n🔍 Diagnóstico: Credenciales incorrectas")
            print("   - Verifica usuario y contraseña")
            print("   - Asegúrate de que el usuario tenga permisos en la base de datos")
            
        elif "cannot open server" in error_msg or "timeout" in error_msg:
            print("\n🔍 Diagnóstico: Problema de conectividad")
            print("   - Verifica que tu IP esté en el firewall de Azure SQL")
            print("   - Ve a Azure Portal > SQL Server > Firewalls y redes virtuales")
            print("   - Agrega tu IP actual a la lista de IPs permitidas")
            
        elif "ssl" in error_msg or "certificate" in error_msg:
            print("\n🔍 Diagnóstico: Problema de SSL/TLS")
            print("   - Azure SQL requiere conexiones encriptadas")
            print("   - Verifica que tengas ODBC Driver 17 instalado")
            
        elif "driver" in error_msg:
            print("\n🔍 Diagnóstico: Driver ODBC no encontrado")
            print("   - Instala Microsoft ODBC Driver 17 for SQL Server")
            print("   - En macOS: brew install mssql-tools18")
            
        return False
        
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

def check_prerequisites():
    """Verificar prerrequisitos del sistema"""
    print("🔧 Verificando prerrequisitos...")
    
    # Verificar pyodbc
    try:
        import pyodbc
        print("✅ pyodbc instalado")
        
        # Listar drivers disponibles
        drivers = [d for d in pyodbc.drivers() if 'SQL Server' in d]
        if drivers:
            print(f"✅ Drivers ODBC encontrados: {', '.join(drivers)}")
        else:
            print("⚠️  No se encontraron drivers ODBC para SQL Server")
            print("   Instala: brew install mssql-tools18")
            
    except ImportError:
        print("❌ pyodbc no instalado")
        print("   Instala: pip install pyodbc")
        return False
    
    # Verificar pandas y sqlalchemy
    try:
        import pandas
        print("✅ pandas instalado")
    except ImportError:
        print("❌ pandas no instalado")
        print("   Instala: pip install pandas")
        return False
        
    try:
        import sqlalchemy
        print("✅ sqlalchemy instalado")
    except ImportError:
        print("❌ sqlalchemy no instalado")
        print("   Instala: pip install sqlalchemy")
        return False
    
    return True

if __name__ == "__main__":
    print("🧪 Test de Conexión - Azure SQL Database Proteo")
    print("=" * 60)
    
    # Verificar prerrequisitos
    if not check_prerequisites():
        print("\n❌ Faltan prerrequisitos. Instala las dependencias faltantes.")
        sys.exit(1)
    
    # Probar conexión
    if test_azure_sql_connection():
        print("\n🎉 ¡Todo listo para la importación de datos!")
        print("\nPróximo paso:")
        print("   python3 import_data.py")
    else:
        print("\n❌ Resuelve los problemas de conexión antes de continuar")
        print("\nSi necesitas ayuda:")
        print("   1. Verifica el firewall de Azure SQL")
        print("   2. Confirma las credenciales")
        print("   3. Asegúrate de tener los drivers ODBC instalados")
