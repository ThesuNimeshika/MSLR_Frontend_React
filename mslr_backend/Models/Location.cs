using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MslrBackend.Models
{
    [Table("LOCATION")]
    public class Location
    {
        [Key]
        [Column("LOCATION_ID")]
        public decimal LocationId { get; set; }

        [Required]
        [MaxLength(120)]
        [Column("LOCATION_NAME")]
        public string LocationName { get; set; } = string.Empty;
    }
}
