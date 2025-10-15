-- =============================================
-- Proteia Database Schema
-- Base de datos para el dashboard de inteligencia comercial
-- =============================================

-- Usar la base de datos existente (reemplazar con tu nombre de BD)
-- USE [TuBaseDeDatos]
-- GO

-- =============================================
-- 1. TABLA DE PRODUCTOS DEL MERCADO
-- =============================================
CREATE TABLE Products (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ASIN NVARCHAR(20) NOT NULL UNIQUE,
    ProductName NVARCHAR(500) NOT NULL,
    Brand NVARCHAR(100) NOT NULL,
    Category NVARCHAR(100) NOT NULL,
    
    -- Precios y métricas financieras
    Price DECIMAL(10,2) NOT NULL,
    AvgPricePerMonth DECIMAL(10,2) NULL,
    MinPrice DECIMAL(10,2) NULL,
    NetMargin DECIMAL(5,2) NULL,
    Net DECIMAL(10,2) NULL,
    FBAFees DECIMAL(10,2) NULL,
    
    -- Métricas de mercado
    Rating DECIMAL(3,2) NULL,
    ReviewCount INT NULL,
    EstSales INT NULL,
    EstRevenue DECIMAL(15,2) NULL,
    PageSalesShare DECIMAL(5,4) NULL,
    PageRevShare DECIMAL(5,4) NULL,
    RevPerReview DECIMAL(10,2) NULL,
    
    -- Métricas de Amazon
    LQS INT NULL, -- Listing Quality Score
    ScoreForPL INT NULL,
    ScoreForReselling INT NULL,
    NumSellers INT NULL,
    Rank INT NULL,
    AvgBSRPerMonth INT NULL,
    Inventory INT NULL,
    
    -- Información del producto
    Weight DECIMAL(8,3) NULL,
    SellerType NVARCHAR(20) NULL,
    Variants INT NULL,
    URL NVARCHAR(500) NULL,
    AvailableFrom DATE NULL,
    BestSellerIn NVARCHAR(200) NULL,
    HasAPlus BIT DEFAULT 0,
    
    -- Búsquedas y términos
    SearchCount INT NULL,
    SearchTerm NVARCHAR(200) NULL,
    ProfitPotential DECIMAL(15,2) NULL,
    
    -- Auditoría
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- =============================================
-- 2. INFORMACIÓN NUTRICIONAL
-- =============================================
CREATE TABLE NutritionalInfo (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    
    -- Macronutrientes (por 100g)
    Energy DECIMAL(8,2) NULL, -- kcal
    Protein DECIMAL(5,2) NULL, -- g
    TotalFat DECIMAL(5,2) NULL, -- g
    SaturatedFat DECIMAL(5,2) NULL, -- g
    TransFat DECIMAL(5,2) NULL, -- mg
    Carbohydrates DECIMAL(5,2) NULL, -- g
    Sugars DECIMAL(5,2) NULL, -- g
    AddedSugars DECIMAL(5,2) NULL, -- g
    DietaryFiber DECIMAL(5,2) NULL, -- g
    
    -- Minerales (mg)
    Sodium DECIMAL(8,2) NULL,
    Potassium DECIMAL(8,2) NULL,
    Calcium DECIMAL(8,2) NULL,
    Iron DECIMAL(8,2) NULL,
    Phosphorus DECIMAL(8,2) NULL,
    
    -- Otros
    Polyalcohols DECIMAL(5,2) NULL,
    
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE
);

-- =============================================
-- 3. ANÁLISIS DE PRODUCTOS POR IA
-- =============================================
CREATE TABLE ProductAnalysis (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    
    -- Análisis de IA
    ValueProposition NVARCHAR(1000) NULL,
    Ingredients NVARCHAR(2000) NULL,
    KeyLabels NVARCHAR(500) NULL,
    PrimaryColors NVARCHAR(100) NULL,
    SecondaryColors NVARCHAR(100) NULL,
    IntendedSegment NVARCHAR(200) NULL,
    AdditionalNotes NVARCHAR(1000) NULL,
    
    -- Métricas de similitud con Proteo50
    SimilarityScore DECIMAL(5,4) NULL,
    CompetitivePosition NVARCHAR(50) NULL,
    
    -- Estrategia comercial
    Barriers NVARCHAR(1000) NULL,
    Playbook NVARCHAR(2000) NULL,
    
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE
);

-- =============================================
-- 4. CATEGORÍAS DE PRODUCTOS
-- =============================================
CREATE TABLE Categories (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(500) NULL,
    ParentCategoryId INT NULL,
    
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (ParentCategoryId) REFERENCES Categories(Id)
);

-- =============================================
-- 5. MARCAS
-- =============================================
CREATE TABLE Brands (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(500) NULL,
    MarketShare DECIMAL(5,4) NULL,
    Country NVARCHAR(50) NULL,
    Website NVARCHAR(200) NULL,
    
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- =============================================
-- 6. CONFIGURACIONES DEL SISTEMA
-- =============================================
CREATE TABLE SystemSettings (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SettingKey NVARCHAR(100) NOT NULL UNIQUE,
    SettingValue NVARCHAR(1000) NOT NULL,
    Description NVARCHAR(500) NULL,
    DataType NVARCHAR(20) DEFAULT 'string', -- string, int, decimal, bool, json
    
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- =============================================
-- 7. LOGS DE AUDITORÍA
-- =============================================
CREATE TABLE AuditLogs (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NULL, -- FK a config.users
    TableName NVARCHAR(100) NOT NULL,
    RecordId INT NOT NULL,
    Action NVARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    OldValues NVARCHAR(MAX) NULL, -- JSON
    NewValues NVARCHAR(MAX) NULL, -- JSON
    
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (UserId) REFERENCES config.users(IdUser)
);

-- =============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =============================================

-- Productos
CREATE INDEX IX_Products_ASIN ON Products(ASIN);
CREATE INDEX IX_Products_Brand ON Products(Brand);
CREATE INDEX IX_Products_Category ON Products(Category);
CREATE INDEX IX_Products_Price ON Products(Price);
CREATE INDEX IX_Products_Rating ON Products(Rating);
CREATE INDEX IX_Products_EstSales ON Products(EstSales);

-- Información nutricional
CREATE INDEX IX_NutritionalInfo_ProductId ON NutritionalInfo(ProductId);
CREATE INDEX IX_NutritionalInfo_Protein ON NutritionalInfo(Protein);

-- Análisis de productos
CREATE INDEX IX_ProductAnalysis_ProductId ON ProductAnalysis(ProductId);
CREATE INDEX IX_ProductAnalysis_SimilarityScore ON ProductAnalysis(SimilarityScore);

GO

-- =============================================
-- VISTAS PARA CONSULTAS COMUNES
-- =============================================

-- Vista completa de productos con información nutricional
CREATE VIEW vw_ProductsComplete AS
SELECT 
    p.*,
    n.Energy, n.Protein, n.TotalFat, n.Carbohydrates, n.DietaryFiber, n.Sodium,
    pa.ValueProposition, pa.SimilarityScore, pa.IntendedSegment
FROM Products p
LEFT JOIN NutritionalInfo n ON p.Id = n.ProductId
LEFT JOIN ProductAnalysis pa ON p.Id = pa.ProductId;

GO

-- Vista de análisis de mercado
CREATE VIEW vw_MarketAnalysis AS
SELECT 
    Brand,
    COUNT(*) as ProductCount,
    AVG(Price) as AvgPrice,
    AVG(Rating) as AvgRating,
    SUM(EstRevenue) as TotalRevenue,
    AVG(CAST(ReviewCount as FLOAT)) as AvgReviews
FROM Products
WHERE EstRevenue IS NOT NULL
GROUP BY Brand;

GO
