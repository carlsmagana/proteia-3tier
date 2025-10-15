using Microsoft.EntityFrameworkCore;
using Proteia.API.Data;
using Proteia.API.DTOs;

namespace Proteia.API.Services
{
    public class ProductService : IProductService
    {
        private readonly ProteiaDbContext _context;
        private readonly ILogger<ProductService> _logger;

        public ProductService(ProteiaDbContext context, ILogger<ProductService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<ProductDto>> GetAllProductsAsync()
        {
            try
            {
                var products = await _context.Products
                    .Include(p => p.NutritionalInfo)
                    .Include(p => p.ProductAnalysis)
                    .Select(p => new ProductDto
                    {
                        Id = p.Id,
                        ASIN = p.ASIN,
                        ProductName = p.ProductName,
                        Brand = p.Brand,
                        Category = p.Category,
                        Price = p.Price,
                        Rating = p.Rating,
                        ReviewCount = p.ReviewCount,
                        EstSales = p.EstSales,
                        EstRevenue = p.EstRevenue,
                        URL = p.URL,
                        NutritionalInfo = p.NutritionalInfo != null ? new NutritionalInfoDto
                        {
                            Energy = p.NutritionalInfo.Energy,
                            Protein = p.NutritionalInfo.Protein,
                            TotalFat = p.NutritionalInfo.TotalFat,
                            Carbohydrates = p.NutritionalInfo.Carbohydrates,
                            DietaryFiber = p.NutritionalInfo.DietaryFiber,
                            Sodium = p.NutritionalInfo.Sodium
                        } : null,
                        ProductAnalysis = p.ProductAnalysis != null ? new ProductAnalysisDto
                        {
                            ValueProposition = p.ProductAnalysis.ValueProposition,
                            KeyLabels = p.ProductAnalysis.KeyLabels,
                            IntendedSegment = p.ProductAnalysis.IntendedSegment,
                            SimilarityScore = p.ProductAnalysis.SimilarityScore
                        } : null
                    })
                    .ToListAsync();

                return products;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all products");
                return new List<ProductDto>();
            }
        }

        public async Task<ProductDto?> GetProductByIdAsync(int id)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.NutritionalInfo)
                    .Include(p => p.ProductAnalysis)
                    .Where(p => p.Id == id)
                    .Select(p => new ProductDto
                    {
                        Id = p.Id,
                        ASIN = p.ASIN,
                        ProductName = p.ProductName,
                        Brand = p.Brand,
                        Category = p.Category,
                        Price = p.Price,
                        Rating = p.Rating,
                        ReviewCount = p.ReviewCount,
                        EstSales = p.EstSales,
                        EstRevenue = p.EstRevenue,
                        URL = p.URL,
                        NutritionalInfo = p.NutritionalInfo != null ? new NutritionalInfoDto
                        {
                            Energy = p.NutritionalInfo.Energy,
                            Protein = p.NutritionalInfo.Protein,
                            TotalFat = p.NutritionalInfo.TotalFat,
                            Carbohydrates = p.NutritionalInfo.Carbohydrates,
                            DietaryFiber = p.NutritionalInfo.DietaryFiber,
                            Sodium = p.NutritionalInfo.Sodium
                        } : null,
                        ProductAnalysis = p.ProductAnalysis != null ? new ProductAnalysisDto
                        {
                            ValueProposition = p.ProductAnalysis.ValueProposition,
                            KeyLabels = p.ProductAnalysis.KeyLabels,
                            IntendedSegment = p.ProductAnalysis.IntendedSegment,
                            SimilarityScore = p.ProductAnalysis.SimilarityScore
                        } : null
                    })
                    .FirstOrDefaultAsync();

                return product;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product by id: {Id}", id);
                return null;
            }
        }

        public async Task<ProductDto?> GetProductByAsinAsync(string asin)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.NutritionalInfo)
                    .Include(p => p.ProductAnalysis)
                    .Where(p => p.ASIN == asin)
                    .Select(p => new ProductDto
                    {
                        Id = p.Id,
                        ASIN = p.ASIN,
                        ProductName = p.ProductName,
                        Brand = p.Brand,
                        Category = p.Category,
                        Price = p.Price,
                        Rating = p.Rating,
                        ReviewCount = p.ReviewCount,
                        EstSales = p.EstSales,
                        EstRevenue = p.EstRevenue,
                        URL = p.URL,
                        NutritionalInfo = p.NutritionalInfo != null ? new NutritionalInfoDto
                        {
                            Energy = p.NutritionalInfo.Energy,
                            Protein = p.NutritionalInfo.Protein,
                            TotalFat = p.NutritionalInfo.TotalFat,
                            Carbohydrates = p.NutritionalInfo.Carbohydrates,
                            DietaryFiber = p.NutritionalInfo.DietaryFiber,
                            Sodium = p.NutritionalInfo.Sodium
                        } : null,
                        ProductAnalysis = p.ProductAnalysis != null ? new ProductAnalysisDto
                        {
                            ValueProposition = p.ProductAnalysis.ValueProposition,
                            KeyLabels = p.ProductAnalysis.KeyLabels,
                            IntendedSegment = p.ProductAnalysis.IntendedSegment,
                            SimilarityScore = p.ProductAnalysis.SimilarityScore
                        } : null
                    })
                    .FirstOrDefaultAsync();

                return product;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product by ASIN: {ASIN}", asin);
                return null;
            }
        }

        public async Task<List<ProductSummaryDto>> GetSimilarProductsAsync(decimal similarityThreshold = 0.5m, int topN = 20)
        {
            try
            {
                var products = await _context.Products
                    .Include(p => p.ProductAnalysis)
                    .Where(p => p.ProductAnalysis != null && 
                               p.ProductAnalysis.SimilarityScore >= similarityThreshold &&
                               p.ASIN != "PROTEO50-REF")
                    .OrderByDescending(p => p.ProductAnalysis!.SimilarityScore)
                    .ThenByDescending(p => p.Rating)
                    .Take(topN)
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

                return products;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting similar products");
                return new List<ProductSummaryDto>();
            }
        }

        public async Task<List<ProductSummaryDto>> SearchProductsAsync(string searchTerm)
        {
            try
            {
                var products = await _context.Products
                    .Include(p => p.ProductAnalysis)
                    .Where(p => p.ProductName.Contains(searchTerm) ||
                               p.Brand.Contains(searchTerm) ||
                               p.Category.Contains(searchTerm) ||
                               (p.SearchTerm != null && p.SearchTerm.Contains(searchTerm)))
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

                return products;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching products with term: {SearchTerm}", searchTerm);
                return new List<ProductSummaryDto>();
            }
        }

        public async Task<List<ProductSummaryDto>> GetProductsByBrandAsync(string brand)
        {
            try
            {
                var products = await _context.Products
                    .Include(p => p.ProductAnalysis)
                    .Where(p => p.Brand == brand)
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

                return products;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products by brand: {Brand}", brand);
                return new List<ProductSummaryDto>();
            }
        }

        public async Task<List<ProductSummaryDto>> GetProductsByCategoryAsync(string category)
        {
            try
            {
                var products = await _context.Products
                    .Include(p => p.ProductAnalysis)
                    .Where(p => p.Category == category)
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

                return products;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products by category: {Category}", category);
                return new List<ProductSummaryDto>();
            }
        }

        public async Task<ProductDto?> GetProteo50Async()
        {
            try
            {
                return await GetProductByAsinAsync("PROTEO50-REF");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting Proteo50");
                return null;
            }
        }
    }
}
