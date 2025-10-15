#!/usr/bin/env python3
"""
Script para verificar el estado de la importación
"""

import pyodbc
from connection_config import get_direct_connection_string

def verify_database_status():
    print("🔍 Verificando estado de la base de datos...")
    
    username = input("Usuario SQL: ").strip()
    password = input("Contraseña: ").strip()
    
    try:
        conn_str = get_direct_connection_string(username, password)
        
        with pyodbc.connect(conn_str) as conn:
            cursor = conn.cursor()
            
            print("\n📊 Verificando tablas existentes...")
            
            # Verificar qué tablas existen
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
            print(f"\n✅ Tablas encontradas ({len(tables)}):")
            for table in tables:
                print(f"   📋 {table.TABLE_SCHEMA}.{table.TABLE_NAME}")
            
            # Verificar datos en tablas principales
            main_tables = [
                ('config', 'users'),
                ('dbo', 'Products'),
                ('dbo', 'NutritionalInfo'),
                ('dbo', 'ProductAnalysis'),
                ('dbo', 'Categories'),
                ('dbo', 'Brands')
            ]
            
            print(f"\n📈 Conteo de registros:")
            for schema, table in main_tables:
                try:
                    cursor.execute(f"SELECT COUNT(*) FROM [{schema}].[{table}]")
                    count = cursor.fetchone()[0]
                    print(f"   📊 {schema}.{table}: {count:,} registros")
                except Exception as e:
                    print(f"   ❌ {schema}.{table}: No existe o error")
            
            # Verificar tablas temporales
            print(f"\n🔄 Verificando tablas temporales:")
            cursor.execute("""
                SELECT name FROM tempdb.sys.tables 
                WHERE name LIKE 'temp_%'
            """)
            temp_tables = cursor.fetchall()
            for temp in temp_tables:
                try:
                    cursor.execute(f"SELECT COUNT(*) FROM tempdb.dbo.[{temp.name}]")
                    count = cursor.fetchone()[0]
                    print(f"   📋 {temp.name}: {count:,} registros")
                except:
                    print(f"   ⚠️  {temp.name}: Error al contar")
            
            return True
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    verify_database_status()
