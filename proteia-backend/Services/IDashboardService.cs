using Proteia.API.DTOs;

namespace Proteia.API.Services
{
    public interface IDashboardService
    {
        Task<MarketOverviewDto> GetMarketOverviewAsync();
        Task<ProductComparisonDto> GetProductComparisonAsync();
        Task<ProspectRankingDto> GetProspectRankingAsync();
        Task<List<BrandStatsDto>> GetBrandAnalysisAsync();
        Task<List<CategoryStatsDto>> GetCategoryAnalysisAsync();
    }
}
