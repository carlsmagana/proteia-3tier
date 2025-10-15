using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Proteia.API.Models
{
    public class ProductAnalysis
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int ProductId { get; set; }
        
        [StringLength(1000)]
        public string? ValueProposition { get; set; }
        
        [StringLength(2000)]
        public string? Ingredients { get; set; }
        
        [StringLength(500)]
        public string? KeyLabels { get; set; }
        
        [StringLength(100)]
        public string? PrimaryColors { get; set; }
        
        [StringLength(100)]
        public string? SecondaryColors { get; set; }
        
        [StringLength(200)]
        public string? IntendedSegment { get; set; }
        
        [StringLength(1000)]
        public string? AdditionalNotes { get; set; }
        
        // Métricas de similitud con Proteo50
        [Column(TypeName = "decimal(5,4)")]
        public decimal? SimilarityScore { get; set; }
        
        [StringLength(50)]
        public string? CompetitivePosition { get; set; }
        
        // Estrategia comercial
        [StringLength(1000)]
        public string? Barriers { get; set; }
        
        [StringLength(2000)]
        public string? Playbook { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;
    }
}
