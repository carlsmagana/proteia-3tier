using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Proteia.API.Models
{
    public class NutritionalInfo
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int ProductId { get; set; }
        
        // Macronutrientes (por 100g)
        [Column(TypeName = "decimal(8,2)")]
        public decimal? Energy { get; set; } // kcal
        
        [Column(TypeName = "decimal(5,2)")]
        public decimal? Protein { get; set; } // g
        
        [Column(TypeName = "decimal(5,2)")]
        public decimal? TotalFat { get; set; } // g
        
        [Column(TypeName = "decimal(5,2)")]
        public decimal? SaturatedFat { get; set; } // g
        
        [Column(TypeName = "decimal(5,2)")]
        public decimal? TransFat { get; set; } // mg
        
        [Column(TypeName = "decimal(5,2)")]
        public decimal? Carbohydrates { get; set; } // g
        
        [Column(TypeName = "decimal(5,2)")]
        public decimal? Sugars { get; set; } // g
        
        [Column(TypeName = "decimal(5,2)")]
        public decimal? AddedSugars { get; set; } // g
        
        [Column(TypeName = "decimal(5,2)")]
        public decimal? DietaryFiber { get; set; } // g
        
        // Minerales (mg)
        [Column(TypeName = "decimal(8,2)")]
        public decimal? Sodium { get; set; }
        
        [Column(TypeName = "decimal(8,2)")]
        public decimal? Potassium { get; set; }
        
        [Column(TypeName = "decimal(8,2)")]
        public decimal? Calcium { get; set; }
        
        [Column(TypeName = "decimal(8,2)")]
        public decimal? Iron { get; set; }
        
        [Column(TypeName = "decimal(8,2)")]
        public decimal? Phosphorus { get; set; }
        
        [Column(TypeName = "decimal(5,2)")]
        public decimal? Polyalcohols { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;
    }
}
