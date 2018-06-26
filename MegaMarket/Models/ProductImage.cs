using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MegaMarket.Models
{
    [Table("ProductImages", Schema = "dbo")]
    public class ProductImage
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }        

        [Column("image_large")]
        [JsonProperty("imageLarge")]
        public string ImageLarge { get; set; }

        [Column("product_id")]
        [JsonProperty("productId")]
        public int ProductId { get; set; }

        [NotMapped]
        [JsonProperty("deleted")]
        public bool Deleted { get; set; }
    }
}