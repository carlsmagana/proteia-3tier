using Microsoft.EntityFrameworkCore;
using Proteia.API.Models;

namespace Proteia.API.Data
{
    public class ProteiaDbContext : DbContext
    {
        public ProteiaDbContext(DbContextOptions<ProteiaDbContext> options) : base(options)
        {
        }
        
        // DbSets
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<NutritionalInfo> NutritionalInfos { get; set; }
        public DbSet<ProductAnalysis> ProductAnalyses { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<UserSession> UserSessions { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure User entity (existing table)
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users", "config");
                entity.HasKey(e => e.IdUser);
                entity.Property(e => e.IdUser).ValueGeneratedOnAdd();
            });
            
            // Configure Product entity
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasIndex(e => e.ASIN).IsUnique();
                entity.HasIndex(e => e.Brand);
                entity.HasIndex(e => e.Category);
                entity.HasIndex(e => e.Price);
                entity.HasIndex(e => e.Rating);
                entity.HasIndex(e => e.EstSales);
            });
            
            // Configure NutritionalInfo entity
            modelBuilder.Entity<NutritionalInfo>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasIndex(e => e.ProductId);
                entity.HasIndex(e => e.Protein);
                
                entity.HasOne(e => e.Product)
                    .WithOne(p => p.NutritionalInfo)
                    .HasForeignKey<NutritionalInfo>(e => e.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
            
            // Configure ProductAnalysis entity
            modelBuilder.Entity<ProductAnalysis>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasIndex(e => e.ProductId);
                entity.HasIndex(e => e.SimilarityScore);
                
                entity.HasOne(e => e.Product)
                    .WithOne(p => p.ProductAnalysis)
                    .HasForeignKey<ProductAnalysis>(e => e.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
            
            // Configure Category entity
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasIndex(e => e.Name).IsUnique();
                
                entity.HasOne(e => e.ParentCategory)
                    .WithMany(c => c.SubCategories)
                    .HasForeignKey(e => e.ParentCategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
            
            // Configure Brand entity
            modelBuilder.Entity<Brand>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasIndex(e => e.Name).IsUnique();
            });
            
            // Configure Role entity
            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasIndex(e => e.RoleName).IsUnique();
            });
            
            // Configure UserRole entity
            modelBuilder.Entity<UserRole>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasIndex(e => new { e.UserId, e.RoleId }).IsUnique();
                
                entity.HasOne(e => e.User)
                    .WithMany(u => u.UserRoles)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(e => e.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(e => e.RoleId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(e => e.AssignedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.AssignedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });
            
            // Configure UserSession entity
            modelBuilder.Entity<UserSession>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.SessionToken).IsUnique();
                entity.HasIndex(e => e.ExpiresAt);
                
                entity.HasOne(e => e.User)
                    .WithMany(u => u.UserSessions)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
