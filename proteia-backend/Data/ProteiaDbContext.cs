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
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Category> Categories { get; set; }
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
                      .HasForeignKey(ur => ur.IdUser);
                      
                entity.HasOne(ur => ur.Role)
                      .WithMany(r => r.UserRoles)
                      .HasForeignKey(ur => ur.IdRole);
            });

            // Configure UserSession relationships
            modelBuilder.Entity<UserSession>(entity =>
            {
                entity.HasOne(us => us.User)
                      .WithMany(u => u.UserSessions)
                      .HasForeignKey(us => us.IdUser);
            });

            // Configure Product relationships
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasOne(p => p.Brand)
                      .WithMany(b => b.Products)
                      .HasForeignKey(p => p.IdBrand);
                      
                entity.HasOne(p => p.Category)
                      .WithMany(c => c.Products)
                      .HasForeignKey(p => p.IdCategory);
                      
                entity.HasOne(p => p.NutritionalInfo)
                      .WithOne(n => n.Product)
                      .HasForeignKey<NutritionalInfo>(n => n.IdProduct);
                      
                entity.HasOne(p => p.ProductAnalysis)
                      .WithOne(pa => pa.Product)
                      .HasForeignKey<ProductAnalysis>(pa => pa.IdProduct);
            });
        }
    }
}
