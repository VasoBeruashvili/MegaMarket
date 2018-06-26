using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MegaMarket.Models
{
    [Table("Products", Schema = "dbo")]
    public class Product
    {
        [Key]
        [Column("id")]
        [JsonProperty("id")]
        public int Id { get; set; }

        [Column("name")]
        [JsonProperty("name")]
        public string Name { get; set; }

        [Column("code")]
        [JsonProperty("code")]
        public string Code { get; set; }

        [Column("description")]
        [JsonProperty("description")]
        public string Description { get; set; }

        [NotMapped]
        [JsonProperty("productImages")]
        public List<ProductImage> ProductImages { get; set; }

        [Column("group_category_id")]
        [JsonProperty("groupCategoryId")]
        public int GroupCategoryId { get; set; }

        [ForeignKey("GroupCategoryId")]
        [JsonProperty("groupCategory")]
        public GroupCategory GroupCategory { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("image_small")]
        [JsonProperty("imageSmall")]
        public string ImageSmall { get; set; }


        [Column("country_id")]
        [JsonProperty("countryId")]
        public int CountryId { get; set; }

        [Column("manufacturer_id")]
        [JsonProperty("manufacturerId")]
        public int ManufacturerId { get; set; }

        [Column("brand_id")]
        [JsonProperty("brandId")]
        public int BrandId { get; set; }

        
        [NotMapped]
        [JsonProperty("country")]
        public Country Country { get; set; }

        [NotMapped]
        [JsonProperty("manufacturer")]
        public Manufacturer Manufacturer { get; set; }

        [NotMapped]
        [JsonProperty("brand")]
        public Brand Brand { get; set; }


        [NotMapped]
        [JsonProperty("deleted")]
        public bool Deleted { get; set; }
    }
}