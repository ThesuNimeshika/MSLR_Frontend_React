using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MslrBackend.Models
{
    [Table("EXPERIENCE_LEVEL")]
    public class ExperienceLevel
    {
        [Key]
        [Column("EXPERIENCE_LEVEL_ID")]
        public decimal ExperienceLevelId { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("EXPERIENCE_NAME")]
        public string ExperienceName { get; set; } = string.Empty;
    }

    [Table("JOB_TYPE")]
    public class JobType
    {
        [Key]
        [Column("JOB_TYPE_ID")]
        public decimal JobTypeId { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("JOB_TYPE_NAME")]
        public string JobTypeName { get; set; } = string.Empty;
    }

    [Table("CLIENT_USER")]
    public class ClientUser
    {
        [Key]
        [Column("CLIENT_USER_ID")]
        public decimal ClientUserId { get; set; }

        [MaxLength(150)]
        [Column("FULL_NAME")]
        public string? FullName { get; set; }

        [MaxLength(150)]
        [Column("EMAIL")]
        public string? Email { get; set; }
    }

    [Table("JOBS")]
    public class Job
    {
        [Key]
        [Column("JOB_ID")]
        public decimal JobId { get; set; }

        [Required]
        [MaxLength(150)]
        [Column("JOB_TITLE")]
        public string JobTitle { get; set; } = string.Empty;

        [Required]
        [Column("JOB_DESCRIPTION")]
        public string JobDescription { get; set; } = string.Empty;

        [MaxLength(50)]
        [Column("SALARY_RANGE")]
        public string? SalaryRange { get; set; }

        [Column("APPLICATION_DEADLINE")]
        public DateTime? ApplicationDeadline { get; set; }

        [Column("REQUIREMENTS")]
        public string? Requirements { get; set; }

        [MaxLength(20)]
        [Column("STATUS")]
        public string Status { get; set; } = "Pending Approval";

        [Column("POSTED_DATE")]
        public DateTime PostedDate { get; set; } = DateTime.Now;

        [Column("CLIENT_USER_ID")]
        public decimal ClientUserId { get; set; }

        [Column("SECTOR_ID")]
        public decimal SectorId { get; set; }

        [Column("LOCATION_ID")]
        public decimal LocationId { get; set; }

        [Column("EXPERIENCE_LEVEL_ID")]
        public decimal ExperienceLevelId { get; set; }

        [Column("JOB_TYPE_ID")]
        public decimal JobTypeId { get; set; }

        [ForeignKey("SectorId")]
        public virtual Sector? Sector { get; set; }

        [ForeignKey("LocationId")]
        public virtual Location? Location { get; set; }
    }
}
