#!/usr/bin/env python3
"""
Script para crear las tablas faltantes y migrar los datos correctamente
"""

import pyodbc
import pandas as pd
from connection_config import get_direct_connection_string

def fix_database():
    print("🔧 Reparando base de datos Proteia...")
    
    username = input("Usuario SQL: ").strip()
    password = input("Contraseña: ").strip()
    
    try:
        conn_str = get_direct_connection_string(username, password)
        
        with pyodbc.connect(conn_str) as conn:
            cursor = conn.cursor()
            
            print("\n📝 Creando tablas faltantes...")
            
            # Crear tabla Categories
            categories_sql = """
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Categories')
            BEGIN
                CREATE TABLE Categories (
                    Id INT IDENTITY(1,1) PRIMARY KEY,
                    Name NVARCHAR(100) NOT NULL UNIQUE,
                    Description NVARCHAR(500) NULL,
                    ParentCategoryId INT NULL,
                    CreatedAt DATETIME2 DEFAULT GETDATE(),
                    FOREIGN KEY (ParentCategoryId) REFERENCES Categories(Id)
                );
                PRINT 'Tabla Categories creada';
            END
            """
            
            # Crear tabla Brands
            brands_sql = """
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Brands')
            BEGIN
                CREATE TABLE Brands (
                    Id INT IDENTITY(1,1) PRIMARY KEY,
                    Name NVARCHAR(100) NOT NULL UNIQUE,
                    Description NVARCHAR(500) NULL,
                    MarketShare DECIMAL(5,4) NULL,
                    Country NVARCHAR(50) NULL,
                    Website NVARCHAR(200) NULL,
                    CreatedAt DATETIME2 DEFAULT GETDATE()
                );
                PRINT 'Tabla Brands creada';
            END
            """
            
            # Ejecutar creación de tablas
            cursor.execute(categories_sql)
            cursor.execute(brands_sql)
            conn.commit()
            
            print("✅ Tablas Categories y Brands creadas")
            
            # Insertar datos iniciales en Categories
            print("\n📊 Insertando categorías iniciales...")
            categories_data = """
            INSERT INTO Categories (Name, Description) VALUES
            ('Salud y Cuidado Personal', 'Productos de salud y cuidado personal'),
            ('Suplementos Proteicos', 'Proteínas en polvo y suplementos'),
            ('Nutrición Deportiva', 'Productos para atletas y deportistas'),
            ('Proteína Vegana', 'Proteínas de origen vegetal'),
            ('Proteína Whey', 'Proteínas de suero de leche'),
            ('Pet Food', 'Alimentos para mascotas'),
            ('Ingredientes Base', 'Ingredientes para la industria alimentaria');
            """
            
            # Insertar datos iniciales en Brands
            brands_data = """
            INSERT INTO Brands (Name, Description, Country) VALUES
            ('BIRDMAN', 'Marca mexicana de suplementos deportivos', 'México'),
            ('OPTIMUM NUTRITION', 'Líder mundial en nutrición deportiva', 'Estados Unidos'),
            ('DYMATIZE', 'Marca premium de proteínas', 'Estados Unidos'),
            ('SASCHA FITNESS', 'Marca de suplementos fitness', 'Venezuela'),
            ('ORGAIN', 'Proteínas orgánicas y naturales', 'Estados Unidos'),
            ('HILLS', 'Alimentos premium para mascotas', 'Estados Unidos'),
            ('PROTEO', 'Ingredientes biotecnológicos', 'México');
            """
            
            cursor.execute(categories_data)
            cursor.execute(brands_data)
            conn.commit()
            
            print("✅ Datos iniciales insertados")
            
            # Migrar datos desde tablas temporales
            print("\n🔄 Migrando datos desde tablas temporales...")
            
            # Verificar si hay datos en temp_products_market
            cursor.execute("SELECT COUNT(*) FROM temp_products_market")
            temp_count = cursor.fetchone()[0]
            print(f"📊 Registros en temp_products_market: {temp_count}")
            
            if temp_count > 0:
                # Migrar productos con sintaxis corregida para Azure SQL
                migrate_products_sql = """
                INSERT INTO Products (
                    ASIN, ProductName, Brand, Category, Price, AvgPricePerMonth, 
                    NetMargin, LQS, ReviewCount, Rating, MinPrice, Net, FBAFees,
                    ScoreForPL, ScoreForReselling, NumSellers, [Rank], AvgBSRPerMonth,
                    Inventory, EstSales, EstRevenue, PageSalesShare, PageRevShare,
                    RevPerReview, ProfitPotential, Weight, SellerType, Variants,
                    URL, SearchCount, SearchTerm, HasAPlus
                )
                SELECT 
                    ISNULL(ASIN, 'UNK-' + CAST(ROW_NUMBER() OVER (ORDER BY [Product Name]) AS NVARCHAR(10))),
                    [Product Name],
                    Brand,
                    Category,
                    TRY_CAST(Price AS DECIMAL(10,2)),
                    TRY_CAST([Avg. Price per Mo] AS DECIMAL(10,2)),
                    TRY_CAST([Net Margin] AS DECIMAL(5,2)),
                    TRY_CAST(LQS AS INT),
                    TRY_CAST([# of Reviews] AS INT),
                    TRY_CAST(Rating AS DECIMAL(3,2)),
                    TRY_CAST([Min. Price] AS DECIMAL(10,2)),
                    TRY_CAST(Net AS DECIMAL(10,2)),
                    TRY_CAST([FBA Fees] AS DECIMAL(10,2)),
                    TRY_CAST([Score for PL] AS INT),
                    TRY_CAST([Score for Reselling] AS INT),
                    TRY_CAST([# of Sellers] AS INT),
                    TRY_CAST([Rank] AS INT),
                    TRY_CAST([Avg. BSR per Mo] AS INT),
                    TRY_CAST(Inventory AS INT),
                    TRY_CAST([Est. Sales] AS INT),
                    TRY_CAST([Est. Revenue] AS DECIMAL(15,2)),
                    TRY_CAST([Page Sales Share] AS DECIMAL(5,4)),
                    TRY_CAST([Page Rev. Share] AS DECIMAL(5,4)),
                    TRY_CAST([Rev. per Review] AS DECIMAL(10,2)),
                    TRY_CAST([Profit Potential] AS DECIMAL(15,2)),
                    TRY_CAST(Weight AS DECIMAL(8,3)),
                    [Seller Type],
                    TRY_CAST(Variants AS INT),
                    URL,
                    TRY_CAST([Cantidad de Búsquedas] AS INT),
                    [Término de Búsqueda],
                    CASE WHEN UPPER([A+]) = 'TRUE' THEN 1 ELSE 0 END
                FROM temp_products_market
                WHERE [Product Name] IS NOT NULL
                """
                
                cursor.execute(migrate_products_sql)
                migrated = cursor.rowcount
                conn.commit()
                print(f"✅ Migrados {migrated} productos")
                
                # Migrar análisis si existe temp_selected_analysis
                cursor.execute("SELECT COUNT(*) FROM temp_selected_analysis")
                analysis_count = cursor.fetchone()[0]
                
                if analysis_count > 0:
                    migrate_analysis_sql = """
                    INSERT INTO ProductAnalysis (
                        ProductId, ValueProposition, Ingredients, KeyLabels,
                        PrimaryColors, SecondaryColors, IntendedSegment, AdditionalNotes
                    )
                    SELECT 
                        p.Id,
                        sa.[Value_Proposition],
                        sa.Ingredients,
                        sa.[Key_Labels],
                        sa.[Primary_Colors],
                        sa.[Secondary_Colors],
                        sa.[Intended_Segment],
                        sa.[Additional_Notes]
                    FROM temp_selected_analysis sa
                    INNER JOIN Products p ON p.ASIN = sa.ASIN
                    WHERE sa.[Value_Proposition] IS NOT NULL
                    """
                    
                    cursor.execute(migrate_analysis_sql)
                    analysis_migrated = cursor.rowcount
                    conn.commit()
                    print(f"✅ Migrados {analysis_migrated} análisis")
            
            # Insertar Proteo50 como referencia
            print("\n🧬 Insertando producto Proteo50...")
            proteo50_sql = """
            IF NOT EXISTS (SELECT 1 FROM Products WHERE ASIN = 'PROTEO50-REF')
            BEGIN
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
                
                DECLARE @Proteo50Id INT = SCOPE_IDENTITY();
                
                INSERT INTO NutritionalInfo (
                    ProductId, Energy, Protein, TotalFat, Carbohydrates, DietaryFiber, Sodium
                ) VALUES (
                    @Proteo50Id, 304, 47.8, 5.1, 3.2, 26.7, 320
                );
                
                INSERT INTO ProductAnalysis (
                    ProductId, ValueProposition, KeyLabels, IntendedSegment, SimilarityScore
                ) VALUES (
                    @Proteo50Id,
                    'Alto en proteína y fibra con carbohidratos disponibles muy bajos. Perfil umami natural.',
                    'Alto en proteína; Fuente de fibra; Bajo en carbohidratos; Origen biotecnológico',
                    'Industria alimentaria; Seasonings; Snacks; Bebidas; Cárnicos; Pet-food',
                    1.0000
                );
                
                PRINT 'Proteo50 insertado como referencia';
            END
            """
            
            cursor.execute(proteo50_sql)
            conn.commit()
            
            # Estadísticas finales
            print("\n📈 Estadísticas finales:")
            tables_to_check = [
                ('config.users', 'config', 'users'),
                ('Products', 'dbo', 'Products'),
                ('NutritionalInfo', 'dbo', 'NutritionalInfo'),
                ('ProductAnalysis', 'dbo', 'ProductAnalysis'),
                ('Categories', 'dbo', 'Categories'),
                ('Brands', 'dbo', 'Brands')
            ]
            
            for display_name, schema, table in tables_to_check:
                cursor.execute(f"SELECT COUNT(*) FROM [{schema}].[{table}]")
                count = cursor.fetchone()[0]
                print(f"   📊 {display_name}: {count:,} registros")
            
            print("\n🎉 ¡Base de datos reparada exitosamente!")
            return True
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    fix_database()
