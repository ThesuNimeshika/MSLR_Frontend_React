using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MslrBackend.Models
{
    [Table("SEEKER")]
    public class Seeker
    {
        [Key]
        [Column("SEEKER_ID")]
        public decimal SeekerId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("FIRST_NAME")]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        [Column("LAST_NAME")]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        [Column("EMAIL")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [Column("PASSWORD_HASH")]
        public string Password { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [Column("PASSWORD_SALT")]
        public string PasswordSalt { get; set; } = string.Empty;

        [MaxLength(20)]
        [Column("GENDER")]
        public string? Gender { get; set; }

        [Column("RECEIVE_EMAILS")]
        public bool ReceiveEmails { get; set; }

        [MaxLength(255)]
        [Column("CV_FILE_NAME")]
        public string? CvFileName { get; set; }

        [MaxLength(500)]
        [Column("CV_FILE_PATH")]
        public string? CvFilePath { get; set; }

        [Column("IS_VERIFIED")]
        public int IsVerified { get; set; } = 0;

        [Column("IS_ACTIVE")]
        public int IsActive { get; set; } = 1;

        [Column("CREATED_AT")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [Column("UPDATED_AT")]
        public DateTime? UpdatedAt { get; set; }

        [Column("SECTOR_ID")]
        public string? SectorId { get; set; }
    }
}
