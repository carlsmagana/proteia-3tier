#!/usr/bin/env python3
"""
Script para importar datos CSV a Azure SQL Database desde macOS
Configurado para: xworld-proteo.database.windows.net/proteo
Requiere: pip install pyodbc pandas sqlalchemy
"""

import pandas as pd
import pyodbc
import os
import sys
from sqlalchemy import create_engine, text
import urllib.parse
from connection_config import DATABASE_CONFIG, get_connection_string, get_direct_connection_string

class ProteiaDataImporter:
    def __init__(self, server, database, username=None, password=None):
        self.server = server
        self.database = database
        self.username = username
        self.password = password
        self.connection_string = self._build_connection_string()
        self.engine = None
        
    def _build_connection_string(self):
        """Construir cadena de conexión para Azure SQL Database"""
        if self.username and self.password:
            return get_connection_string(self.username, self.password)
        else:
            raise ValueError("Azure SQL Database requiere autenticación SQL Server (usuario y contraseña)")
    
    def test_connection(self):
        """Probar conexión a la base de datos"""
        try:
            self.engine = create_engine(self.connection_string)
            with self.engine.connect() as conn:
                result = conn.execute(text("SELECT 1"))
                print("✓ Conexión exitosa a SQL Server")
                return True
        except Exception as e:
            print(f"✗ Error de conexión: {e}")
            return False
    
    def execute_sql_file(self, file_path):
        """Ejecutar un archivo SQL"""
        if not os.path.exists(file_path):
            print(f"⚠️  Archivo no encontrado: {file_path}")
            return False
            
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                sql_content = file.read()
            
            # Dividir por GO statements
            sql_batches = [batch.strip() for batch in sql_content.split('GO') if batch.strip()]
            
            with self.engine.connect() as conn:
                for i, batch in enumerate(sql_batches):
                    if batch:
                        print(f"  Ejecutando lote {i+1}/{len(sql_batches)}...")
                        conn.execute(text(batch))
                        conn.commit()
            
            print(f"✓ Ejecutado: {os.path.basename(file_path)}")
            return True
            
        except Exception as e:
            print(f"✗ Error ejecutando {file_path}: {e}")
            return False
    
    def import_csv_to_temp_table(self, csv_path, table_name):
        """Importar CSV a tabla temporal"""
        if not os.path.exists(csv_path):
            print(f"⚠️  CSV no encontrado: {csv_path}")
            return False
        
        try:
            print(f"📊 Importando {os.path.basename(csv_path)}...")
            
            # Leer CSV
            df = pd.read_csv(csv_path, encoding='utf-8')
            print(f"  Filas encontradas: {len(df)}")
            
            # Limpiar nombres de columnas
            df.columns = [col.replace(' ', '_').replace('#', 'Num').replace('.', '_') 
                         for col in df.columns]
            
            # Importar a tabla temporal
            temp_table_name = f"temp_{table_name}"
            df.to_sql(temp_table_name, self.engine, if_exists='replace', index=False)
            
            print(f"✓ Importado a tabla temporal: {temp_table_name}")
            return True
            
        except Exception as e:
            print(f"✗ Error importando CSV: {e}")
            return False
    
    def migrate_products_data(self):
        """Migrar datos de productos desde tabla temporal"""
        migration_sql = """
        -- Migrar productos principales
        INSERT INTO Products (
            ASIN, ProductName, Brand, Category, Price, AvgPricePerMonth, 
            NetMargin, LQS, ReviewCount, Rating, MinPrice, Net, FBAFees,
            ScoreForPL, ScoreForReselling, NumSellers, Rank, AvgBSRPerMonth,
            Inventory, EstSales, EstRevenue, PageSalesShare, PageRevShare,
            RevPerReview, ProfitPotential, Weight, SellerType, Variants,
            URL, SearchCount, SearchTerm, HasAPlus
        )
        SELECT 
            ISNULL(ASIN, 'UNK-' + CAST(ROW_NUMBER() OVER (ORDER BY Product_Name) AS NVARCHAR(10))),
            Product_Name,
            Brand,
            Category,
            CAST(Price AS DECIMAL(10,2)),
            CAST(Avg__Price_per_Mo AS DECIMAL(10,2)),
            CAST(Net_Margin AS DECIMAL(5,2)),
            CAST(LQS AS INT),
            CAST(Num_of_Reviews AS INT),
            CAST(Rating AS DECIMAL(3,2)),
            CAST(Min__Price AS DECIMAL(10,2)),
            CAST(Net AS DECIMAL(10,2)),
            CAST(FBA_Fees AS DECIMAL(10,2)),
            CAST(Score_for_PL AS INT),
            CAST(Score_for_Reselling AS INT),
            CAST(Num_of_Sellers AS INT),
            CAST(Rank AS INT),
            CAST(Avg__BSR_per_Mo AS INT),
            CAST(Inventory AS INT),
            CAST(Est__Sales AS INT),
            CAST(Est__Revenue AS DECIMAL(15,2)),
            CAST(Page_Sales_Share AS DECIMAL(5,4)),
            CAST(Page_Rev__Share AS DECIMAL(5,4)),
            CAST(Rev__per_Review AS DECIMAL(10,2)),
            CAST(Profit_Potential AS DECIMAL(15,2)),
            CAST(Weight AS DECIMAL(8,3)),
            Seller_Type,
            CAST(Variants AS INT),
            URL,
            CAST(Cantidad_de_Búsquedas AS INT),
            Término_de_Búsqueda,
            CASE WHEN UPPER(APlus) = 'TRUE' THEN 1 ELSE 0 END
        FROM temp_products_market
        WHERE Product_Name IS NOT NULL
        """
        
        try:
            with self.engine.connect() as conn:
                result = conn.execute(text(migration_sql))
                conn.commit()
                print(f"✓ Migrados {result.rowcount} productos")
                return True
        except Exception as e:
            print(f"✗ Error migrando productos: {e}")
            return False
    
    def migrate_analysis_data(self):
        """Migrar datos de análisis desde tabla temporal"""
        migration_sql = """
        -- Migrar análisis de productos
        INSERT INTO ProductAnalysis (
            ProductId, ValueProposition, Ingredients, KeyLabels,
            PrimaryColors, SecondaryColors, IntendedSegment, AdditionalNotes
        )
        SELECT 
            p.Id,
            sa.Value_Proposition,
            sa.Ingredients,
            sa.Key_Labels,
            sa.Primary_Colors,
            sa.Secondary_Colors,
            sa.Intended_Segment,
            sa.Additional_Notes
        FROM temp_selected_analysis sa
        INNER JOIN Products p ON p.ASIN = sa.ASIN
        WHERE sa.Value_Proposition IS NOT NULL
        """
        
        try:
            with self.engine.connect() as conn:
                result = conn.execute(text(migration_sql))
                conn.commit()
                print(f"✓ Migrados {result.rowcount} análisis")
                return True
        except Exception as e:
            print(f"✗ Error migrando análisis: {e}")
            return False
    
    def show_statistics(self):
        """Mostrar estadísticas de la base de datos"""
        stats_sql = """
        SELECT 'Products' as TableName, COUNT(*) as RecordCount FROM Products
        UNION ALL
        SELECT 'NutritionalInfo' as TableName, COUNT(*) as RecordCount FROM NutritionalInfo
        UNION ALL
        SELECT 'ProductAnalysis' as TableName, COUNT(*) as RecordCount FROM ProductAnalysis
        UNION ALL
        SELECT 'Categories' as TableName, COUNT(*) as RecordCount FROM Categories
        UNION ALL
        SELECT 'Brands' as TableName, COUNT(*) as RecordCount FROM Brands
        """
        
        try:
            df = pd.read_sql(stats_sql, self.engine)
            print("\n📈 Estadísticas de la Base de Datos:")
            print(df.to_string(index=False))
        except Exception as e:
            print(f"⚠️  No se pudieron obtener estadísticas: {e}")

def main():
    print("🚀 Importador de datos Proteia para Azure SQL Database")
    print("=" * 60)
    print(f"🌐 Servidor: {DATABASE_CONFIG['server']}")
    print(f"🗄️  Base de datos: {DATABASE_CONFIG['database']}")
    print("=" * 60)
    
    # Configuración preestablecida para Azure SQL
    SERVER = DATABASE_CONFIG['server']
    DATABASE = DATABASE_CONFIG['database']
    
    print("\n🔐 Credenciales de Azure SQL Database:")
    USERNAME = input("Usuario SQL: ").strip()
    PASSWORD = input("Contraseña: ").strip()
    
    if not USERNAME or not PASSWORD:
        print("❌ Usuario y contraseña son requeridos para Azure SQL Database")
        return
    
    # Rutas de archivos
    project_path = "/Users/carlosmagana/CascadeProjects/proteia"
    csv_files = {
        "products_market": f"{project_path}/data/Products_market.csv",
        "selected_analysis": f"{project_path}/figma/data/Selected_Products_AI.csv"
    }
    
    sql_files = [
        f"{project_path}/database/01_create_tables.sql",
        f"{project_path}/database/02_initial_data.sql",
        f"{project_path}/database/04_user_integration.sql"
    ]
    
    # Crear importador
    importer = ProteiaDataImporter(SERVER, DATABASE, USERNAME, PASSWORD)
    
    # Probar conexión
    if not importer.test_connection():
        print("❌ No se pudo conectar a la base de datos")
        return
    
    # Ejecutar scripts SQL
    print("\n📝 Ejecutando scripts SQL...")
    for sql_file in sql_files:
        importer.execute_sql_file(sql_file)
    
    # Importar CSVs
    print("\n📊 Importando archivos CSV...")
    for table_name, csv_path in csv_files.items():
        importer.import_csv_to_temp_table(csv_path, table_name)
    
    # Migrar datos
    print("\n🔄 Migrando datos a tablas principales...")
    importer.migrate_products_data()
    importer.migrate_analysis_data()
    
    # Mostrar estadísticas
    importer.show_statistics()
    
    print("\n✅ Importación completada exitosamente!")

if __name__ == "__main__":
    main()
