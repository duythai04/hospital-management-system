using Microsoft.AspNetCore.Mvc;
using hospital_backend.Data;
using hospital_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace hospital_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public PatientController(HospitalDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatients()
        {
            return await _context.Patients.ToListAsync();
        }
    }
}