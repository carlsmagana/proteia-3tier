using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Proteia.API.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(20)]
        public string ASIN { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string ProductName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Brand { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Category { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal? AvgPricePerMonth { get; set; }
        
        [Column(TypeName = "decimal(5,2)")]
        public decimal? NetMargin { get; set; }
        
        public int? LQS { get; set; }
        
        public int? ReviewCount { get; set; }
        
        [Column(TypeName = "decimal(3,2)")]
        public decimal? Rating { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal? MinPrice { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal? Net { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal? FBAFees { get; set; }
        
        public int? ScoreForPL { get; set; }
        
        public int? ScoreForReselling { get; set; }
        
        public int? NumSellers { get; set; }
        
        public int? Rank { get; set; }
        
        public int? AvgBSRPerMonth { get; set; }
        
        public int? Inventory { get; set; }
        
        public int? EstSales { get; set; }
        
        [Column(TypeName = "decimal(15,2)")]
        public decimal? EstRevenue { get; set; }
        
        [Column(TypeName = "decimal(5,4)")]
        public decimal? PageSalesShare { get; set; }
        
        [Column(TypeName = "decimal(5,4)")]
        public decimal? PageRevShare { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal? RevPerReview { get; set; }
        
        [Column(TypeName = "decimal(15,2)")]
        public decimal? ProfitPotential { get; set; }
        
        [Column(TypeName = "decimal(8,3)")]
        public decimal? Weight { get; set; }
        
        [StringLength(20)]
        public string? SellerType { get; set; }
        
        public int? Variants { get; set; }
        
        [StringLength(500)]
        public string? URL { get; set; }
        
        public int? SearchCount { get; set; }
        
        [StringLength(200)]
        public string? SearchTerm { get; set; }
        
        public bool HasAPlus { get; set; }
        
        public DateTime? AvailableFrom { get; set; }
        
        [StringLength(200)]
        public string? BestSellerIn { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual NutritionalInfo? NutritionalInfo { get; set; }
        public virtual ProductAnalysis? ProductAnalysis { get; set; }
    }
}
