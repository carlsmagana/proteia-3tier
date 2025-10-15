#!/usr/bin/env python3
"""
Script para verificar que todas las tablas existen
"""

import pyodbc
from connection_config import get_direct_connection_string

def verify_tables():
    print("🔍 Verificando tablas en la base de datos...")
    
    username = "proteoadmin"
    password = "$3d2z@Se9IPW"
    
    try:
        conn_str = get_direct_connection_string(username, password)
        
        with pyodbc.connect(conn_str) as conn:
            cursor = conn.cursor()
            
            # Verificar todas las tablas
            print("\n📋 Tablas existentes:")
            cursor.execute("""
                SELECT 
                    TABLE_SCHEMA,
                    TABLE_NAME,
                    TABLE_TYPE
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_TYPE = 'BASE TABLE'
                ORDER BY TABLE_SCHEMA, TABLE_NAME
            """)
            
            tables = cursor.fetchall()
            
            required_tables = [
                ('config', 'users'),
                ('dbo', 'Products'),
                ('dbo', 'Roles'),
                ('dbo', 'UserRoles'),
                ('dbo', 'UserSessions')
            ]
            
            existing_tables = [(t.TABLE_SCHEMA, t.TABLE_NAME) for t in tables]
            
            print(f"Total tablas encontradas: {len(tables)}")
            for table in tables:
                status = "✅" if (table.TABLE_SCHEMA, table.TABLE_NAME) in required_tables else "ℹ️"
                print(f"   {status} {table.TABLE_SCHEMA}.{table.TABLE_NAME}")
            
            print(f"\n🔍 Verificando tablas requeridas:")
            missing_tables = []
            for schema, table in required_tables:
                if (schema, table) in existing_tables:
                    print(f"   ✅ {schema}.{table}")
                else:
                    print(f"   ❌ {schema}.{table} - FALTA")
                    missing_tables.append(f"{schema}.{table}")
            
            if missing_tables:
                print(f"\n❌ Faltan {len(missing_tables)} tablas:")
                for table in missing_tables:
                    print(f"   - {table}")
                
                print(f"\n🔧 Necesitas ejecutar los scripts de creación:")
                print(f"   1. 01_create_tables.sql")
                print(f"   2. 02_initial_data.sql") 
                print(f"   3. 04_user_integration.sql")
            else:
                print(f"\n✅ Todas las tablas requeridas existen!")
                
                # Verificar datos en config.users
                print(f"\n👥 Usuarios en config.users:")
                cursor.execute("SELECT IdUser, NameUser, Email FROM config.users")
                users = cursor.fetchall()
                
                if users:
                    for user in users:
                        print(f"   ID: {user.IdUser}, Nombre: {user.NameUser}, Email: {user.Email}")
                else:
                    print("   ❌ No hay usuarios")
                    
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    verify_tables()
