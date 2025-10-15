using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Proteia.API.DTOs;
using Proteia.API.Services;

namespace Proteia.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(IDashboardService dashboardService, ILogger<DashboardController> logger)
        {
            _dashboardService = dashboardService;
            _logger = logger;
        }

        /// <summary>
        /// Obtener vista general del mercado
        /// </summary>
        [HttpGet("market-overview")]
        public async Task<ActionResult<MarketOverviewDto>> GetMarketOverview()
        {
            try
            {
                var overview = await _dashboardService.GetMarketOverviewAsync();
                return Ok(overview);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting market overview");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Obtener comparación de productos
        /// </summary>
        [HttpGet("product-comparison")]
        public async Task<ActionResult<ProductComparisonDto>> GetProductComparison()
        {
            try
            {
                var comparison = await _dashboardService.GetProductComparisonAsync();
                return Ok(comparison);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product comparison");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Obtener ranking de prospectos
        /// </summary>
        [HttpGet("prospect-ranking")]
        public async Task<ActionResult<ProspectRankingDto>> GetProspectRanking()
        {
            try
            {
                var ranking = await _dashboardService.GetProspectRankingAsync();
                return Ok(ranking);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting prospect ranking");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Obtener análisis por marcas
        /// </summary>
        [HttpGet("brand-analysis")]
        public async Task<ActionResult<List<BrandStatsDto>>> GetBrandAnalysis()
        {
            try
            {
                var analysis = await _dashboardService.GetBrandAnalysisAsync();
                return Ok(analysis);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting brand analysis");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Obtener análisis por categorías
        /// </summary>
        [HttpGet("category-analysis")]
        public async Task<ActionResult<List<CategoryStatsDto>>> GetCategoryAnalysis()
        {
            try
            {
                var analysis = await _dashboardService.GetCategoryAnalysisAsync();
                return Ok(analysis);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting category analysis");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }
    }
}
