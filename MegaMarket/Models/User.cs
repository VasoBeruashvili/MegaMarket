using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MegaMarket.Models
{
    [Table("Users", Schema = "dbo")]
    public class User
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Display(Name = "UserName")]
        [Column("username")]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        [Column("password")]
        public string Password { get; set; }

        [Column("full_name")]
        public string FullName { get; set; }
    }
}