using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Proteia.API.Models
{
    [Table("users", Schema = "config")]
    public class User
    {
        [Key]
        public int IdUser { get; set; }
        
        [StringLength(200)]
        public string? NameUser { get; set; }
        
        [StringLength(200)]
        public string? Email { get; set; }
        
        [StringLength(50)]
        public string? Password { get; set; }
        
        // Navigation properties
        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
        public virtual ICollection<UserSession> UserSessions { get; set; } = new List<UserSession>();
    }
}
