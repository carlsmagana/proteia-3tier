#!/usr/bin/env python3
"""
Script para verificar columnas y corregir la migración
"""

import pyodbc
from connection_config import get_direct_connection_string

def fix_column_migration():
    print("🔍 Verificando columnas y corrigiendo migración...")
    
    username = input("Usuario SQL: ").strip()
    password = input("Contraseña: ").strip()
    
    try:
        conn_str = get_direct_connection_string(username, password)
        
        with pyodbc.connect(conn_str) as conn:
            cursor = conn.cursor()
            
            # Verificar columnas de temp_products_market
            print("\n📋 Verificando columnas en temp_products_market...")
            cursor.execute("""
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'temp_products_market'
                ORDER BY ORDINAL_POSITION
            """)
            
            columns = [row[0] for row in cursor.fetchall()]
            print("✅ Columnas encontradas:")
            for i, col in enumerate(columns, 1):
                print(f"   {i:2d}. {col}")
            
            # Crear mapeo correcto de columnas
            column_mapping = {
                'ProductName': None,
                'Brand': None,
                'Category': None,
                'Price': None,
                'Rating': None,
                'Reviews': None,
                'ASIN': None
            }
            
            # Buscar columnas por patrones
            for col in columns:
                col_lower = col.lower()
                if 'product' in col_lower and 'name' in col_lower:
                    column_mapping['ProductName'] = col
                elif col_lower == 'brand':
                    column_mapping['Brand'] = col
                elif col_lower == 'category':
                    column_mapping['Category'] = col
                elif col_lower == 'price':
                    column_mapping['Price'] = col
                elif col_lower == 'rating':
                    column_mapping['Rating'] = col
                elif 'review' in col_lower:
                    column_mapping['Reviews'] = col
                elif col_lower == 'asin':
                    column_mapping['ASIN'] = col
            
            print(f"\n🔗 Mapeo de columnas detectado:")
            for key, value in column_mapping.items():
                print(f"   {key}: {value}")
            
            # Migrar con nombres correctos
            print(f"\n🔄 Migrando datos con columnas correctas...")
            
            # Usar los nombres reales de las columnas
            migrate_sql = f"""
            INSERT INTO Products (
                ASIN, ProductName, Brand, Category, Price, Rating, ReviewCount
            )
            SELECT 
                ISNULL([{column_mapping['ASIN'] or 'ASIN'}], 'UNK-' + CAST(ROW_NUMBER() OVER (ORDER BY [{column_mapping['ProductName'] or columns[0]}]) AS NVARCHAR(10))),
                [{column_mapping['ProductName'] or columns[0]}],
                [{column_mapping['Brand'] or 'Brand'}],
                [{column_mapping['Category'] or 'Category'}],
                TRY_CAST([{column_mapping['Price'] or 'Price'}] AS DECIMAL(10,2)),
                TRY_CAST([{column_mapping['Rating'] or 'Rating'}] AS DECIMAL(3,2)),
                TRY_CAST([{column_mapping['Reviews'] or columns[-1]}] AS INT)
            FROM temp_products_market
            WHERE [{column_mapping['ProductName'] or columns[0]}] IS NOT NULL
            """
            
            print("📝 Ejecutando migración...")
            cursor.execute(migrate_sql)
            migrated = cursor.rowcount
            conn.commit()
            
            print(f"✅ Migrados {migrated} productos")
            
            # Insertar Proteo50 si no existe
            print("\n🧬 Verificando Proteo50...")
            cursor.execute("SELECT COUNT(*) FROM Products WHERE ASIN = 'PROTEO50-REF'")
            proteo_exists = cursor.fetchone()[0]
            
            if proteo_exists == 0:
                proteo50_sql = """
                INSERT INTO Products (
                    ASIN, ProductName, Brand, Category, Price, Rating, ReviewCount,
                    Weight, SellerType, SearchTerm, CreatedAt
                ) VALUES (
                    'PROTEO50-REF', 
                    'Proteo50 - Concentrado Proteico de Levadura', 
                    'PROTEO', 
                    'Ingredientes Base', 
                    850.00, 
                    5.0, 
                    0,
                    1.0, 
                    'Manufacturer', 
                    'Proteina De Levadura', 
                    GETDATE()
                );
                """
                cursor.execute(proteo50_sql)
                conn.commit()
                print("✅ Proteo50 insertado")
            else:
                print("✅ Proteo50 ya existe")
            
            # Estadísticas finales
            print(f"\n📈 Estadísticas finales:")
            
            stats_queries = [
                ("Products", "SELECT COUNT(*) FROM Products"),
                ("Categories", "SELECT COUNT(*) FROM Categories"),
                ("Brands", "SELECT COUNT(*) FROM Brands"),
                ("config.users", "SELECT COUNT(*) FROM config.users")
            ]
            
            for name, query in stats_queries:
                try:
                    cursor.execute(query)
                    count = cursor.fetchone()[0]
                    print(f"   📊 {name}: {count:,} registros")
                except Exception as e:
                    print(f"   ❌ {name}: Error - {e}")
            
            print(f"\n🎉 ¡Migración completada exitosamente!")
            print(f"\n🚀 Próximo paso: Crear el backend .NET 8")
            
            return True
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    fix_column_migration()
