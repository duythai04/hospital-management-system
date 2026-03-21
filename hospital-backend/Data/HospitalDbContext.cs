using Microsoft.EntityFrameworkCore;
using hospital_backend.Models;

namespace hospital_backend.Data
{
    public class HospitalDbContext : DbContext
    {
        public HospitalDbContext(DbContextOptions<HospitalDbContext> options)
            : base(options)
        {
        }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Doctor> Doctors {get; set;}
    }
}