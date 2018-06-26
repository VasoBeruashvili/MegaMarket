using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MegaMarket.Models
{
    [Table("Units", Schema = "dbo")]
    public class Unit
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("short_name")]
        public string ShortName { get; set; }

        [Required]
        [Column("full_name")]
        public string FullName { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }


        [NotMapped]
        public bool Deleted { get; set; }
    }
}