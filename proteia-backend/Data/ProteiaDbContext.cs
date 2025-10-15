using Microsoft.EntityFrameworkCore;
using Proteia.API.Models;

namespace Proteia.API.Data
{
    public class ProteiaDbContext : DbContext
    {
        public ProteiaDbContext(DbContextOptions<ProteiaDbContext> options) : base(options)
        {
        }

        // DbSets for all entities
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<UserSession> UserSessions { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<NutritionalInfo> NutritionalInfos { get; set; }
        public DbSet<ProductAnalysis> ProductAnalyses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users", "config");
                entity.HasKey(e => e.IdUser);
                entity.Property(e => e.NameUser).HasMaxLength(200);
                entity.Property(e => e.Email).HasMaxLength(200);
                entity.Property(e => e.Password).HasMaxLength(50);
            });

            // Configure UserRole relationships
            modelBuilder.Entity<UserRole>(entity =>
            {
                entity.HasOne(ur => ur.User)
                      .WithMany(u => u.UserRoles)
                      .HasForeignKey(ur => ur.UserId);
                      
                entity.HasOne(ur => ur.Role)
                      .WithMany(r => r.UserRoles)
                      .HasForeignKey(ur => ur.RoleId);
            });

            // Configure Product relationships
            modelBuilder.Entity<NutritionalInfo>(entity =>
            {
                entity.HasOne(n => n.Product)
                      .WithOne(p => p.NutritionalInfo)
                      .HasForeignKey<NutritionalInfo>(n => n.ProductId);
            });
            
            modelBuilder.Entity<ProductAnalysis>(entity =>
            {
                entity.HasOne(pa => pa.Product)
                      .WithOne(p => p.ProductAnalysis)
                      .HasForeignKey<ProductAnalysis>(pa => pa.ProductId);
            });
        }
    }
}
