using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MegaMarket.Models
{
    [Table("ProductParamTypes", Schema = "dbo")]
    public class ProductParamType
    {
        [Key]
        [Column("id")]
        [JsonProperty("id")]
        public int Id { get; set; }

        [Required]
        [Column("name")]
        [JsonProperty("name")]
        public string Name { get; set; }

        [Required]
        [Column("type")]
        public int Type { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }


        [NotMapped]
        public bool Deleted { get; set; }

        [NotMapped]
        public string TypeName { get; set; }
    }
}