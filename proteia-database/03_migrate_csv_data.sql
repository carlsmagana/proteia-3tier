-- =============================================
-- Script para migrar datos CSV a SQL Server
-- =============================================

-- NOTA: Este script asume que ya has importado los CSV a tablas temporales
-- Puedes usar SQL Server Import/Export Wizard o BULK INSERT

-- =============================================
-- 1. CREAR TABLAS TEMPORALES PARA CSV
-- =============================================

-- Tabla temporal para Products_market.csv
CREATE TABLE #TempProductsMarket (
    ProductName NVARCHAR(500),
    Brand NVARCHAR(100),
    Category NVARCHAR(100),
    SearchCount INT,
    SearchTerm NVARCHAR(200),
    Price DECIMAL(10,2),
    AvgPricePerMonth DECIMAL(10,2),
    NetMargin DECIMAL(5,2),
    LQS INT,
    ReviewCount INT,
    Rating DECIMAL(3,2),
    MinPrice DECIMAL(10,2),
    Net DECIMAL(10,2),
    FBAFees DECIMAL(10,2),
    ScoreForPL INT,
    ScoreForReselling INT,
    NumSellers INT,
    Rank INT,
    AvgBSRPerMonth INT,
    Inventory INT,
    EstSales INT,
    EstRevenue DECIMAL(15,2),
    PageSalesShare DECIMAL(5,4),
    PageRevShare DECIMAL(5,4),
    RevPerReview DECIMAL(10,2),
    ProfitPotential DECIMAL(15,2),
    AvailableFrom NVARCHAR(20),
    BestSellerIn NVARCHAR(200),
    APlus NVARCHAR(10),
    Weight DECIMAL(8,3),
    SellerType NVARCHAR(20),
    Variants INT,
    ASIN NVARCHAR(20),
    URL NVARCHAR(500)
);

-- Tabla temporal para Selected_Products_AI.csv
CREATE TABLE #TempSelectedProducts (
    ASIN NVARCHAR(20),
    ProductName NVARCHAR(500),
    NutritionalValues NVARCHAR(1000),
    Ingredients NVARCHAR(2000),
    ValueProposition NVARCHAR(1000),
    KeyLabels NVARCHAR(500),
    PrimaryColors NVARCHAR(100),
    SecondaryColors NVARCHAR(100),
    IntendedSegment NVARCHAR(200),
    AdditionalNotes NVARCHAR(1000)
);

-- =============================================
-- 2. COMANDOS BULK INSERT (EJECUTAR MANUALMENTE)
-- =============================================

/*
-- Reemplaza las rutas con las rutas reales de tus archivos CSV

BULK INSERT #TempProductsMarket
FROM '/Users/carlosmagana/CascadeProjects/proteia/data/Products_market.csv'
WITH (
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n',
    FIRSTROW = 2,
    CODEPAGE = '65001' -- UTF-8
);

BULK INSERT #TempSelectedProducts  
FROM '/Users/carlosmagana/CascadeProjects/proteia/figma/data/Selected_Products_AI.csv'
WITH (
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n',
    FIRSTROW = 2,
    CODEPAGE = '65001' -- UTF-8
);
*/

-- =============================================
-- 3. MIGRAR DATOS A TABLAS PRINCIPALES
-- =============================================

-- Migrar productos del mercado
INSERT INTO Products (
    ASIN, ProductName, Brand, Category, Price, AvgPricePerMonth, NetMargin,
    LQS, ReviewCount, Rating, MinPrice, Net, FBAFees, ScoreForPL, 
    ScoreForReselling, NumSellers, Rank, AvgBSRPerMonth, Inventory,
    EstSales, EstRevenue, PageSalesShare, PageRevShare, RevPerReview,
    ProfitPotential, AvailableFrom, BestSellerIn, HasAPlus, Weight,
    SellerType, Variants, URL, SearchCount, SearchTerm
)
SELECT 
    ISNULL(ASIN, 'UNKNOWN-' + CAST(ROW_NUMBER() OVER (ORDER BY ProductName) AS NVARCHAR(10))),
    ProductName,
    Brand,
    Category,
    Price,
    AvgPricePerMonth,
    NetMargin,
    LQS,
    ReviewCount,
    Rating,
    MinPrice,
    Net,
    FBAFees,
    ScoreForPL,
    ScoreForReselling,
    NumSellers,
    Rank,
    AvgBSRPerMonth,
    Inventory,
    EstSales,
    EstRevenue,
    PageSalesShare,
    PageRevShare,
    RevPerReview,
    ProfitPotential,
    CASE 
        WHEN AvailableFrom IS NOT NULL AND ISDATE(AvailableFrom) = 1 
        THEN CAST(AvailableFrom AS DATE)
        ELSE NULL 
    END,
    BestSellerIn,
    CASE WHEN UPPER(APlus) = 'TRUE' THEN 1 ELSE 0 END,
    Weight,
    SellerType,
    Variants,
    URL,
    SearchCount,
    SearchTerm
FROM #TempProductsMarket
WHERE ProductName IS NOT NULL;

-- =============================================
-- 4. PROCESAR INFORMACIÓN NUTRICIONAL
-- =============================================

-- Función para extraer valores nutricionales del texto
CREATE FUNCTION fn_ExtractNutritionalValue(@Text NVARCHAR(1000), @Nutrient NVARCHAR(50))
RETURNS DECIMAL(8,2)
AS
BEGIN
    DECLARE @Result DECIMAL(8,2) = NULL;
    DECLARE @Pattern NVARCHAR(100);
    DECLARE @StartPos INT, @EndPos INT;
    DECLARE @ValueStr NVARCHAR(20);
    
    -- Patrones para diferentes nutrientes
    SET @Pattern = CASE @Nutrient
        WHEN 'Protein' THEN 'Proteína[s]?[:\s]*([0-9]+[.,]?[0-9]*)[g%]?'
        WHEN 'Fat' THEN 'Grasas?[:\s]*([0-9]+[.,]?[0-9]*)[g%]?'
        WHEN 'Carbs' THEN 'Carbohidratos?[:\s]*([0-9]+[.,]?[0-9]*)[g%]?'
        WHEN 'Fiber' THEN 'Fibra[:\s]*([0-9]+[.,]?[0-9]*)[g%]?'
        WHEN 'Energy' THEN 'Calorías?[:\s]*([0-9]+[.,]?[0-9]*)'
        ELSE ''
    END;
    
    -- Buscar el patrón en el texto (implementación simplificada)
    SET @StartPos = CHARINDEX(@Nutrient, @Text);
    IF @StartPos > 0
    BEGIN
        SET @StartPos = @StartPos + LEN(@Nutrient);
        WHILE @StartPos <= LEN(@Text) AND SUBSTRING(@Text, @StartPos, 1) NOT LIKE '[0-9]'
            SET @StartPos = @StartPos + 1;
            
        SET @EndPos = @StartPos;
        WHILE @EndPos <= LEN(@Text) AND SUBSTRING(@Text, @EndPos, 1) LIKE '[0-9.,]'
            SET @EndPos = @EndPos + 1;
            
        IF @EndPos > @StartPos
        BEGIN
            SET @ValueStr = SUBSTRING(@Text, @StartPos, @EndPos - @StartPos);
            SET @ValueStr = REPLACE(@ValueStr, ',', '.');
            
            IF ISNUMERIC(@ValueStr) = 1
                SET @Result = CAST(@ValueStr AS DECIMAL(8,2));
        END
    END
    
    RETURN @Result;
END;

GO

-- Insertar información nutricional extraída
INSERT INTO NutritionalInfo (ProductId, Energy, Protein, TotalFat, Carbohydrates, DietaryFiber)
SELECT 
    p.Id,
    dbo.fn_ExtractNutritionalValue(sp.NutritionalValues, 'Energy'),
    dbo.fn_ExtractNutritionalValue(sp.NutritionalValues, 'Protein'),
    dbo.fn_ExtractNutritionalValue(sp.NutritionalValues, 'Fat'),
    dbo.fn_ExtractNutritionalValue(sp.NutritionalValues, 'Carbs'),
    dbo.fn_ExtractNutritionalValue(sp.NutritionalValues, 'Fiber')
FROM Products p
INNER JOIN #TempSelectedProducts sp ON p.ASIN = sp.ASIN
WHERE sp.NutritionalValues IS NOT NULL;

-- =============================================
-- 5. MIGRAR ANÁLISIS DE PRODUCTOS
-- =============================================

INSERT INTO ProductAnalysis (
    ProductId, ValueProposition, Ingredients, KeyLabels, 
    PrimaryColors, SecondaryColors, IntendedSegment, AdditionalNotes
)
SELECT 
    p.Id,
    sp.ValueProposition,
    sp.Ingredients,
    sp.KeyLabels,
    sp.PrimaryColors,
    sp.SecondaryColors,
    sp.IntendedSegment,
    sp.AdditionalNotes
FROM Products p
INNER JOIN #TempSelectedProducts sp ON p.ASIN = sp.ASIN;

-- =============================================
-- 6. CALCULAR SIMILITUDES CON PROTEO50
-- =============================================

-- Actualizar scores de similitud basados en características nutricionales
UPDATE pa
SET SimilarityScore = (
    -- Similitud basada en proteína (peso 40%)
    CASE 
        WHEN n.Protein BETWEEN 40 AND 55 THEN 0.4
        WHEN n.Protein BETWEEN 35 AND 60 THEN 0.3
        WHEN n.Protein BETWEEN 25 AND 65 THEN 0.2
        ELSE 0.1
    END +
    -- Similitud basada en fibra (peso 30%)
    CASE 
        WHEN n.DietaryFiber BETWEEN 20 AND 35 THEN 0.3
        WHEN n.DietaryFiber BETWEEN 15 AND 40 THEN 0.2
        WHEN n.DietaryFiber BETWEEN 10 AND 45 THEN 0.1
        ELSE 0.05
    END +
    -- Similitud basada en carbohidratos bajos (peso 20%)
    CASE 
        WHEN n.Carbohydrates BETWEEN 0 AND 5 THEN 0.2
        WHEN n.Carbohydrates BETWEEN 0 AND 10 THEN 0.15
        WHEN n.Carbohydrates BETWEEN 0 AND 15 THEN 0.1
        ELSE 0.05
    END +
    -- Similitud basada en aplicación/segmento (peso 10%)
    CASE 
        WHEN pa.IntendedSegment LIKE '%Pet%' OR pa.IntendedSegment LIKE '%Snack%' 
             OR pa.IntendedSegment LIKE '%Seasoning%' THEN 0.1
        ELSE 0.05
    END
)
FROM ProductAnalysis pa
INNER JOIN Products p ON pa.ProductId = p.Id
INNER JOIN NutritionalInfo n ON p.Id = n.ProductId
WHERE p.ASIN != 'PROTEO50-REF';

-- =============================================
-- 7. LIMPIAR TABLAS TEMPORALES
-- =============================================

DROP TABLE #TempProductsMarket;
DROP TABLE #TempSelectedProducts;
DROP FUNCTION fn_ExtractNutritionalValue;

-- =============================================
-- 8. ESTADÍSTICAS FINALES
-- =============================================

SELECT 'Migration Summary' as Status;

SELECT 
    'Products Migrated' as Metric,
    COUNT(*) as Count
FROM Products;

SELECT 
    'Nutritional Records' as Metric,
    COUNT(*) as Count
FROM NutritionalInfo;

SELECT 
    'Analysis Records' as Metric,
    COUNT(*) as Count
FROM ProductAnalysis;

SELECT 
    'Products with Similarity > 0.5' as Metric,
    COUNT(*) as Count
FROM ProductAnalysis
WHERE SimilarityScore > 0.5;

GO
