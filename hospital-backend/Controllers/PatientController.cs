using Microsoft.AspNetCore.Mvc;
using hospital_backend.Data;
using hospital_backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

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


        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatientById(int id)
        {
            var patient = await _context.Patients.FindAsync(id);

            if(patient  == null)
            {
                return NotFound();
            }
            return patient;
        }

        [HttpPost]
        public async Task<ActionResult<Patient>> CreatePatient([FromBody] Patient patient)
        {
            if (patient == null){
                return BadRequest("Dữ liệu không hợp lệ");
                
            }
            patient.Created_at = DateTime.Now;
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();
            return CreatedAtAction(
                nameof(GetPatientById),
                new {id = patient.Id},
                patient
            );
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);

            if (patient == null)
            {
                return NotFound(new {message = "Không tìm thấy bệnh nhân"});

            }

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return Ok(new {message = "Xóa bệnh nhân thành công"});
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(int id, Patient patient)
        {
            if (id != patient.Id) return BadRequest();

            _context.Entry(patient).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}