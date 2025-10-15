using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Proteia.API.DTOs;
using Proteia.API.Services;

namespace Proteia.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(IProductService productService, ILogger<ProductsController> logger)
        {
            _productService = productService;
            _logger = logger;
        }

        /// <summary>
        /// Obtener todos los productos
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<ProductDto>>> GetAllProducts()
        {
            try
            {
                var products = await _productService.GetAllProductsAsync();
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all products");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Obtener producto por ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProductById(int id)
        {
            try
            {
                var product = await _productService.GetProductByIdAsync(id);
                
                if (product == null)
                {
                    return NotFound(new { message = "Producto no encontrado" });
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product by id: {Id}", id);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Obtener producto por ASIN
        /// </summary>
        [HttpGet("asin/{asin}")]
        public async Task<ActionResult<ProductDto>> GetProductByAsin(string asin)
        {
            try
            {
                var product = await _productService.GetProductByAsinAsync(asin);
                
                if (product == null)
                {
                    return NotFound(new { message = "Producto no encontrado" });
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product by ASIN: {ASIN}", asin);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Obtener productos similares a Proteo50
        /// </summary>
        [HttpGet("similar")]
        public async Task<ActionResult<List<ProductSummaryDto>>> GetSimilarProducts(
            [FromQuery] decimal similarityThreshold = 0.5m,
            [FromQuery] int topN = 20)
        {
            try
            {
                var products = await _productService.GetSimilarProductsAsync(similarityThreshold, topN);
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting similar products");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Buscar productos por término
        /// </summary>
        [HttpGet("search")]
        public async Task<ActionResult<List<ProductSummaryDto>>> SearchProducts([FromQuery] string searchTerm)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    return BadRequest(new { message = "Término de búsqueda requerido" });
                }

                var products = await _productService.SearchProductsAsync(searchTerm);
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching products with term: {SearchTerm}", searchTerm);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Obtener productos por marca
        /// </summary>
        [HttpGet("brand/{brand}")]
        public async Task<ActionResult<List<ProductSummaryDto>>> GetProductsByBrand(string brand)
        {
            try
            {
                var products = await _productService.GetProductsByBrandAsync(brand);
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products by brand: {Brand}", brand);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Obtener productos por categoría
        /// </summary>
        [HttpGet("category/{category}")]
        public async Task<ActionResult<List<ProductSummaryDto>>> GetProductsByCategory(string category)
        {
            try
            {
                var products = await _productService.GetProductsByCategoryAsync(category);
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products by category: {Category}", category);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Obtener información de Proteo50
        /// </summary>
        [HttpGet("proteo50")]
        public async Task<ActionResult<ProductDto>> GetProteo50()
        {
            try
            {
                var product = await _productService.GetProteo50Async();
                
                if (product == null)
                {
                    return NotFound(new { message = "Proteo50 no encontrado" });
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting Proteo50");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }
    }
}
