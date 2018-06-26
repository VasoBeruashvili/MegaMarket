using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MegaMarket.Models
{
    [Table("GroupCategories", Schema = "dbo")]
    public class GroupCategory
    {
        [Key]
        [Column("id")]
        [JsonProperty("id")]
        public int Id { get; set; }

        [Required]
        [Column("name")]
        [JsonProperty("name")]
        public string Name { get; set; }

        [Column("order_by")]
        [JsonProperty("orderBy")]
        public int OrderBy { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("parent_id")]
        [JsonProperty("parentId")]
        public int ParentId { get; set; }

        [Column("main_group_id")]
        [JsonProperty("mainGroupId")]
        public int? MainGroupId { get; set; }

        [Column("path")]
        [JsonProperty("path")]
        public string Path { get; set; }

        [Column("icon_name")]
        [JsonProperty("icon")]
        public string IconName { get; set; }

        [JsonProperty("products")]
        public ICollection<Product> Products { get; set; }


        [NotMapped]
        [JsonProperty("expanded")]
        public bool Expanded { get; set; }

        [NotMapped]
        [JsonProperty("iconImage")]
        public string IconImage { get; set; }

        [NotMapped]
        [JsonProperty("deleted")]
        public bool Deleted { get; set; }
    }
}