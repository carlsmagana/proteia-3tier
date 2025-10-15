using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Proteia.API.Models
{
    public class Brand
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [Column(TypeName = "decimal(5,4)")]
        public decimal? MarketShare { get; set; }
        
        [StringLength(50)]
        public string? Country { get; set; }
        
        [StringLength(200)]
        public string? Website { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
