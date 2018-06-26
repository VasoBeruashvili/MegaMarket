using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MegaMarket.Models
{
    [Table("Countries", Schema = "dbo")]
    public class Country
    {
        [Column("id")]
        [JsonProperty("id")]
        public int Id { get; set; }

        [Column("name")]
        [JsonProperty("name")]
        public string Name { get; set; }

        [Column("code")]
        [JsonProperty("code")]
        public string Code { get; set; }
    }
}