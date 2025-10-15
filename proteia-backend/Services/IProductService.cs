using Proteia.API.DTOs;

namespace Proteia.API.Services
{
    public interface IProductService
    {
        Task<List<ProductDto>> GetAllProductsAsync();
        Task<ProductDto?> GetProductByIdAsync(int id);
        Task<ProductDto?> GetProductByAsinAsync(string asin);
        Task<List<ProductSummaryDto>> GetSimilarProductsAsync(decimal similarityThreshold = 0.5m, int topN = 20);
        Task<List<ProductSummaryDto>> SearchProductsAsync(string searchTerm);
        Task<List<ProductSummaryDto>> GetProductsByBrandAsync(string brand);
        Task<List<ProductSummaryDto>> GetProductsByCategoryAsync(string category);
        Task<ProductDto?> GetProteo50Async();
    }
}
