-- =============================================
-- Datos iniciales para Proteia Database
-- =============================================

-- =============================================
-- 1. CATEGORÍAS INICIALES
-- =============================================
INSERT INTO Categories (Name, Description) VALUES
('Salud y Cuidado Personal', 'Productos de salud y cuidado personal'),
('Suplementos Proteicos', 'Proteínas en polvo y suplementos'),
('Nutrición Deportiva', 'Productos para atletas y deportistas'),
('Proteína Vegana', 'Proteínas de origen vegetal'),
('Proteína Whey', 'Proteínas de suero de leche'),
('Pet Food', 'Alimentos para mascotas'),
('Ingredientes Base', 'Ingredientes para la industria alimentaria');

-- =============================================
-- 2. MARCAS PRINCIPALES
-- =============================================
INSERT INTO Brands (Name, Description, Country) VALUES
('BIRDMAN', 'Marca mexicana de suplementos deportivos', 'México'),
('OPTIMUM NUTRITION', 'Líder mundial en nutrición deportiva', 'Estados Unidos'),
('DYMATIZE', 'Marca premium de proteínas', 'Estados Unidos'),
('SASCHA FITNESS', 'Marca de suplementos fitness', 'Venezuela'),
('ORGAIN', 'Proteínas orgánicas y naturales', 'Estados Unidos'),
('HILLS', 'Alimentos premium para mascotas', 'Estados Unidos'),
('PROTEO', 'Ingredientes biotecnológicos', 'México');

-- =============================================
-- 3. CONFIGURACIONES DEL SISTEMA
-- =============================================
INSERT INTO SystemSettings (SettingKey, SettingValue, Description, DataType) VALUES
('app.name', 'Proteia Intelligence Dashboard', 'Nombre de la aplicación', 'string'),
('app.version', '2.0.0', 'Versión actual de la aplicación', 'string'),
('market.focus', 'México', 'Mercado principal de análisis', 'string'),
('currency.default', 'MXN', 'Moneda por defecto', 'string'),
('currency.symbol', '$', 'Símbolo de moneda', 'string'),
('analysis.similarity_threshold', '0.7', 'Umbral mínimo de similitud para análisis', 'decimal'),
('dashboard.refresh_interval', '300', 'Intervalo de actualización en segundos', 'int'),
('export.max_records', '10000', 'Máximo número de registros para exportar', 'int'),
('auth.session_timeout', '480', 'Tiempo de sesión en minutos', 'int'),
('proteo50.target_price', '850', 'Precio objetivo para Proteo50 por kg', 'decimal');

-- =============================================
-- 4. PRODUCTO PROTEO50 (REFERENCIA)
-- =============================================
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

-- Obtener el ID del producto Proteo50 recién insertado
DECLARE @Proteo50Id INT = SCOPE_IDENTITY();

-- Información nutricional de Proteo50
INSERT INTO NutritionalInfo (
    ProductId, Energy, Protein, TotalFat, Carbohydrates, DietaryFiber, Sodium
) VALUES (
    @Proteo50Id, 304, 47.8, 5.1, 3.2, 26.7, 320
);

-- Análisis de Proteo50
INSERT INTO ProductAnalysis (
    ProductId, ValueProposition, KeyLabels, IntendedSegment, SimilarityScore
) VALUES (
    @Proteo50Id,
    'Alto en proteína y fibra con carbohidratos disponibles muy bajos. Perfil umami natural que permite reducir sodio manteniendo palatibilidad.',
    'Alto en proteína; Fuente de fibra; Bajo en carbohidratos; Origen biotecnológico',
    'Industria alimentaria; Seasonings; Snacks; Bebidas; Cárnicos; Pet-food',
    1.0000
);

-- =============================================
-- 5. PROCEDIMIENTOS ALMACENADOS ÚTILES
-- =============================================

-- Procedimiento para obtener análisis de mercado
CREATE PROCEDURE sp_GetMarketAnalysis
AS
BEGIN
    SELECT 
        'Total Products' as Metric,
        COUNT(*) as Value,
        'count' as Type
    FROM Products
    
    UNION ALL
    
    SELECT 
        'Average Price' as Metric,
        AVG(Price) as Value,
        'currency' as Type
    FROM Products
    WHERE Price > 0
    
    UNION ALL
    
    SELECT 
        'Average Rating' as Metric,
        AVG(Rating) as Value,
        'rating' as Type
    FROM Products
    WHERE Rating IS NOT NULL
    
    UNION ALL
    
    SELECT 
        'Total Revenue' as Metric,
        SUM(EstRevenue) as Value,
        'currency' as Type
    FROM Products
    WHERE EstRevenue IS NOT NULL;
END;

-- Procedimiento para obtener productos similares a Proteo50
CREATE PROCEDURE sp_GetSimilarProducts
    @SimilarityThreshold DECIMAL(5,4) = 0.5,
    @TopN INT = 20
AS
BEGIN
    SELECT TOP (@TopN)
        p.Id,
        p.ProductName,
        p.Brand,
        p.Price,
        p.Rating,
        pa.SimilarityScore,
        n.Protein,
        n.DietaryFiber
    FROM Products p
    INNER JOIN ProductAnalysis pa ON p.Id = pa.ProductId
    LEFT JOIN NutritionalInfo n ON p.Id = n.ProductId
    WHERE pa.SimilarityScore >= @SimilarityThreshold
        AND p.ASIN != 'PROTEO50-REF'
    ORDER BY pa.SimilarityScore DESC, p.Rating DESC;
END;

-- Procedimiento para obtener análisis por marca
CREATE PROCEDURE sp_GetBrandAnalysis
AS
BEGIN
    SELECT 
        p.Brand,
        COUNT(*) as ProductCount,
        AVG(p.Price) as AvgPrice,
        AVG(p.Rating) as AvgRating,
        SUM(p.EstRevenue) as TotalRevenue,
        AVG(CAST(p.ReviewCount as FLOAT)) as AvgReviews,
        AVG(n.Protein) as AvgProtein
    FROM Products p
    LEFT JOIN NutritionalInfo n ON p.Id = n.ProductId
    WHERE p.Brand != 'PROTEO'
    GROUP BY p.Brand
    HAVING COUNT(*) > 0
    ORDER BY TotalRevenue DESC, AvgRating DESC;
END;

GO

-- =============================================
-- 6. FUNCIONES ÚTILES
-- =============================================

-- Función para calcular precio por gramo de proteína
CREATE FUNCTION fn_PricePerProteinGram(@ProductId INT)
RETURNS DECIMAL(10,4)
AS
BEGIN
    DECLARE @Result DECIMAL(10,4);
    
    SELECT @Result = 
        CASE 
            WHEN n.Protein > 0 AND p.Weight > 0 
            THEN p.Price / (n.Protein * p.Weight * 10) -- Convertir a gramos
            ELSE NULL 
        END
    FROM Products p
    INNER JOIN NutritionalInfo n ON p.Id = n.ProductId
    WHERE p.Id = @ProductId;
    
    RETURN @Result;
END;

GO
