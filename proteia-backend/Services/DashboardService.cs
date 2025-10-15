using Microsoft.EntityFrameworkCore;
using Proteia.API.Data;
using Proteia.API.DTOs;

namespace Proteia.API.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly ProteiaDbContext _context;
        private readonly ILogger<DashboardService> _logger;

        public DashboardService(ProteiaDbContext context, ILogger<DashboardService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<MarketOverviewDto> GetMarketOverviewAsync()
        {
            try
            {
                var totalProducts = await _context.Products.CountAsync();
                var averagePrice = await _context.Products.Where(p => p.Price > 0).AverageAsync(p => p.Price);
                var averageRating = await _context.Products.Where(p => p.Rating.HasValue).AverageAsync(p => p.Rating!.Value);
                var totalRevenue = await _context.Products.Where(p => p.EstRevenue.HasValue).SumAsync(p => p.EstRevenue!.Value);

                var categoryStats = await GetCategoryAnalysisAsync();
                var brandStats = await GetBrandAnalysisAsync();

                return new MarketOverviewDto
                {
                    TotalProducts = totalProducts,
                    AveragePrice = Math.Round(averagePrice, 2),
                    AverageRating = Math.Round(averageRating, 2),
                    TotalRevenue = Math.Round(totalRevenue, 2),
                    CategoryStats = categoryStats,
                    BrandStats = brandStats.Take(10).ToList() // Top 10 brands
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting market overview");
                return new MarketOverviewDto();
            }
        }

        public async Task<ProductComparisonDto> GetProductComparisonAsync()
        {
            try
            {
                // Obtener Proteo50
                var proteo50 = await _context.Products
                    .Include(p => p.ProductAnalysis)
                    .Where(p => p.ASIN == "PROTEO50-REF")
                    .Select(p => new ProductSummaryDto
                    {
                        Id = p.Id,
                        ASIN = p.ASIN,
                        ProductName = p.ProductName,
                        Brand = p.Brand,
                        Price = p.Price,
                        Rating = p.Rating,
                        SimilarityScore = p.ProductAnalysis != null ? p.ProductAnalysis.SimilarityScore : null
                    })
                    .FirstOrDefaultAsync();

                // Productos similares (top 10)
                var similarProducts = await _context.Products
                    .Include(p => p.ProductAnalysis)
                    .Where(p => p.ProductAnalysis != null && 
                               p.ProductAnalysis.SimilarityScore >= 0.6m &&
                               p.ASIN != "PROTEO50-REF")
                    .OrderByDescending(p => p.ProductAnalysis!.SimilarityScore)
                    .Take(10)
                    .Select(p => new ProductSummaryDto
                    {
                        Id = p.Id,
                        ASIN = p.ASIN,
                        ProductName = p.ProductName,
                        Brand = p.Brand,
                        Price = p.Price,
                        Rating = p.Rating,
                        SimilarityScore = p.ProductAnalysis!.SimilarityScore
                    })
                    .ToListAsync();

                // Productos competidores (top brands)
                var competitorProducts = await _context.Products
                    .Include(p => p.ProductAnalysis)
                    .Where(p => p.Brand != "PROTEO" && p.Rating >= 4.0m)
                    .OrderByDescending(p => p.EstRevenue)
                    .Take(15)
                    .Select(p => new ProductSummaryDto
                    {
                        Id = p.Id,
                        ASIN = p.ASIN,
                        ProductName = p.ProductName,
                        Brand = p.Brand,
                        Price = p.Price,
                        Rating = p.Rating,
                        SimilarityScore = p.ProductAnalysis != null ? p.ProductAnalysis.SimilarityScore : null
                    })
                    .ToListAsync();

                return new ProductComparisonDto
                {
                    Proteo50 = proteo50 ?? new ProductSummaryDto(),
                    SimilarProducts = similarProducts,
                    CompetitorProducts = competitorProducts
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product comparison");
                return new ProductComparisonDto();
            }
        }

        public async Task<ProspectRankingDto> GetProspectRankingAsync()
        {
            try
            {
                // Top prospects basados en similitud y oportunidad
                var topProspects = await _context.Products
                    .Include(p => p.ProductAnalysis)
                    .Include(p => p.NutritionalInfo)
                    .Where(p => p.ProductAnalysis != null && 
                               p.ProductAnalysis.SimilarityScore >= 0.4m &&
                               p.ASIN != "PROTEO50-REF")
                    .OrderByDescending(p => p.ProductAnalysis!.SimilarityScore)
                    .ThenByDescending(p => p.EstRevenue)
                    .Take(20)
                    .Select(p => new ProspectDto
                    {
                        Id = p.Id,
                        ProductName = p.ProductName,
                        Brand = p.Brand,
                        Price = p.Price,
                        SimilarityScore = p.ProductAnalysis!.SimilarityScore,
                        Protein = p.NutritionalInfo != null ? p.NutritionalInfo.Protein : null,
                        IntendedSegment = p.ProductAnalysis.IntendedSegment,
                        OpportunityReason = GenerateOpportunityReason(p.ProductAnalysis.SimilarityScore, p.Price, p.EstRevenue)
                    })
                    .ToListAsync();

                // Oportunidades de mercado por categoría
                var marketOpportunities = await _context.Products
                    .Where(p => p.EstRevenue.HasValue)
                    .GroupBy(p => p.Category)
                    .Select(g => new OpportunityDto
                    {
                        Category = g.Key,
                        Description = $"Oportunidad en {g.Key}",
                        PotentialRevenue = g.Sum(p => p.EstRevenue!.Value),
                        ProductCount = g.Count(),
                        AveragePrice = g.Average(p => p.Price)
                    })
                    .OrderByDescending(o => o.PotentialRevenue)
                    .Take(5)
                    .ToListAsync();

                return new ProspectRankingDto
                {
                    TopProspects = topProspects,
                    MarketOpportunities = marketOpportunities
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting prospect ranking");
                return new ProspectRankingDto();
            }
        }

        public async Task<List<BrandStatsDto>> GetBrandAnalysisAsync()
        {
            try
            {
                var brandStats = await _context.Products
                    .Include(p => p.NutritionalInfo)
                    .Where(p => p.Brand != "PROTEO")
                    .GroupBy(p => p.Brand)
                    .Select(g => new BrandStatsDto
                    {
                        Name = g.Key,
                        ProductCount = g.Count(),
                        AveragePrice = Math.Round(g.Average(p => p.Price), 2),
                        AverageRating = Math.Round(g.Where(p => p.Rating.HasValue).Average(p => p.Rating!.Value), 2),
                        TotalRevenue = Math.Round(g.Where(p => p.EstRevenue.HasValue).Sum(p => p.EstRevenue!.Value), 2),
                        AverageProtein = Math.Round(g.Where(p => p.NutritionalInfo != null && p.NutritionalInfo.Protein.HasValue)
                                                    .Average(p => p.NutritionalInfo!.Protein!.Value), 2)
                    })
                    .OrderByDescending(b => b.TotalRevenue)
                    .ToListAsync();

                return brandStats;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting brand analysis");
                return new List<BrandStatsDto>();
            }
        }

        public async Task<List<CategoryStatsDto>> GetCategoryAnalysisAsync()
        {
            try
            {
                var categoryStats = await _context.Products
                    .GroupBy(p => p.Category)
                    .Select(g => new CategoryStatsDto
                    {
                        Name = g.Key,
                        ProductCount = g.Count(),
                        AveragePrice = Math.Round(g.Average(p => p.Price), 2),
                        TotalRevenue = Math.Round(g.Where(p => p.EstRevenue.HasValue).Sum(p => p.EstRevenue!.Value), 2)
                    })
                    .OrderByDescending(c => c.TotalRevenue)
                    .ToListAsync();

                return categoryStats;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting category analysis");
                return new List<CategoryStatsDto>();
            }
        }

        private static string GenerateOpportunityReason(decimal? similarityScore, decimal price, decimal? revenue)
        {
            if (similarityScore >= 0.8m)
                return "Alta similitud con Proteo50 - Oportunidad de sustitución directa";
            else if (similarityScore >= 0.6m && price > 1000)
                return "Similitud media con precio premium - Oportunidad de competir en calidad";
            else if (revenue > 1000000)
                return "Alto volumen de ventas - Oportunidad de mercado establecido";
            else
                return "Oportunidad de nicho - Potencial de crecimiento";
        }
    }
}
