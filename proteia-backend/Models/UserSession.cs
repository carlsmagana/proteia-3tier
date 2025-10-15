using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Proteia.API.Models
{
    public class UserSession
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        [StringLength(500)]
        public string SessionToken { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? RefreshToken { get; set; }
        
        [Required]
        public DateTime ExpiresAt { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime LastActivity { get; set; } = DateTime.UtcNow;
        
        public bool IsActive { get; set; } = true;
        
        [StringLength(500)]
        public string? UserAgent { get; set; }
        
        [StringLength(50)]
        public string? IpAddress { get; set; }
        
        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
    }
}
