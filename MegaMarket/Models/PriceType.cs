using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MegaMarket.Models
{
    [Table("PriceTypes", Schema = "dbo")]
    public class PriceType
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }


        [NotMapped]
        public bool Deleted { get; set; }
    }
}