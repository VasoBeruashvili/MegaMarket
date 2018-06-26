using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MegaMarket.Models
{
    [Table("GroupParams", Schema = "dbo")]
    public class GroupParam
    {
        [Key]
        [Column("id")]
        [JsonProperty("id")]
        public int Id { get; set; }

        [Column("group_category_id")]
        [JsonProperty("groupCategoryId")]
        public int GroupCategoryId { get; set; }

        [Column("product_param_type_id")]
        [JsonProperty("productParamTypeId")]
        public int ProductParamTypeId { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }


        [NotMapped]
        [JsonProperty("deleted")]
        public bool Deleted { get; set; }
    }
}