namespace Proteia.API.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string ASIN { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? Rating { get; set; }
        public int? ReviewCount { get; set; }
        public int? EstSales { get; set; }
        public decimal? EstRevenue { get; set; }
        public string? URL { get; set; }
        public NutritionalInfoDto? NutritionalInfo { get; set; }
        public ProductAnalysisDto? ProductAnalysis { get; set; }
    }
    
    public class NutritionalInfoDto
    {
        public decimal? Energy { get; set; }
        public decimal? Protein { get; set; }
        public decimal? TotalFat { get; set; }
        public decimal? Carbohydrates { get; set; }
        public decimal? DietaryFiber { get; set; }
        public decimal? Sodium { get; set; }
    }
    
    public class ProductAnalysisDto
    {
        public string? ValueProposition { get; set; }
        public string? KeyLabels { get; set; }
        public string? IntendedSegment { get; set; }
        public decimal? SimilarityScore { get; set; }
    }
    
    public class ProductSummaryDto
    {
        public int Id { get; set; }
        public string ASIN { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? Rating { get; set; }
        public decimal? SimilarityScore { get; set; }
    }
}
