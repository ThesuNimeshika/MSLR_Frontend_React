using Microsoft.EntityFrameworkCore;
using MslrBackend.Models;

namespace MslrBackend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Sector> Sectors { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<ExperienceLevel> ExperienceLevels { get; set; }
        public DbSet<JobType> JobTypes { get; set; }
        public DbSet<ClientUser> ClientUsers { get; set; }
        public DbSet<Job> Jobs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Handle generated identity if needed, but EF Core Oracle provider 
            // usually handles NUMBER GENERATED ALWAYS AS IDENTITY automatically.
        }
    }
}
