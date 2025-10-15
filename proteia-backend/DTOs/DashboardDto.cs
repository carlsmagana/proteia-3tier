namespace Proteia.API.DTOs
{
    public class MarketOverviewDto
    {
        public int TotalProducts { get; set; }
        public decimal AveragePrice { get; set; }
        public decimal AverageRating { get; set; }
        public decimal TotalRevenue { get; set; }
        public List<CategoryStatsDto> CategoryStats { get; set; } = new List<CategoryStatsDto>();
        public List<BrandStatsDto> BrandStats { get; set; } = new List<BrandStatsDto>();
    }
    
    public class CategoryStatsDto
    {
        public string Name { get; set; } = string.Empty;
        public int ProductCount { get; set; }
        public decimal AveragePrice { get; set; }
        public decimal TotalRevenue { get; set; }
    }
    
    public class BrandStatsDto
    {
        public string Name { get; set; } = string.Empty;
        public int ProductCount { get; set; }
        public decimal AveragePrice { get; set; }
        public decimal AverageRating { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal AverageProtein { get; set; }
    }
    
    public class ProductComparisonDto
    {
        public ProductSummaryDto Proteo50 { get; set; } = new ProductSummaryDto();
        public List<ProductSummaryDto> SimilarProducts { get; set; } = new List<ProductSummaryDto>();
        public List<ProductSummaryDto> CompetitorProducts { get; set; } = new List<ProductSummaryDto>();
    }
    
    public class ProspectRankingDto
    {
        public List<ProspectDto> TopProspects { get; set; } = new List<ProspectDto>();
        public List<OpportunityDto> MarketOpportunities { get; set; } = new List<OpportunityDto>();
    }
    
    public class ProspectDto
    {
        public int Id { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? SimilarityScore { get; set; }
        public decimal? Protein { get; set; }
        public string? IntendedSegment { get; set; }
        public string OpportunityReason { get; set; } = string.Empty;
    }
    
    public class OpportunityDto
    {
        public string Category { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal PotentialRevenue { get; set; }
        public int ProductCount { get; set; }
        public decimal AveragePrice { get; set; }
    }
}
