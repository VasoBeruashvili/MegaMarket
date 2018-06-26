using MegaMarket.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace MegaMarket.Utils
{
    public class MMContext : DbContext
    {
        public MMContext() : base("MMContext")
        {
            this.Configuration.LazyLoadingEnabled = false;
            this.Configuration.ValidateOnSaveEnabled = false;
            this.Configuration.AutoDetectChangesEnabled = false;
        }

        public DbSet<User> Users { get; set; }
        public DbSet<PriceType> PriceTypes { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<ProductParamType> ProductParamTypes { get; set; }
        public DbSet<GroupCategory> GroupCategories { get; set; }
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<GroupParam> GroupParams { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Manufacturer> Manufacturers { get; set; }
        public DbSet<Brand> Brands { get; set; }
    }
}