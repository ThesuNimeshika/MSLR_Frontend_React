using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MslrBackend.Models
{
    [Table("SECTOR")]
    public class Sector
    {
        [Key]
        [Column("SECTOR_ID")]
        public decimal SectorId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("SECTOR_NAME")]
        public string SectorName { get; set; } = string.Empty;

        [MaxLength(100)]
        [Column("SUB_SECTOR_NAME")]
        public string? SubSectorName { get; set; }
    }
}
