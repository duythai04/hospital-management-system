using Microsoft.AspNetCore.Mvc;
using hospital_backend.Data;
using hospital_backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace hospital_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PatientController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public PatientController(HospitalDbContext context)
        {
            _context = context;
        }

        // Helper lấy userId + role (tránh lặp code)
        private (int? userId, string role) GetCurrentUser()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userIdStr) || string.IsNullOrEmpty(role))
                return (null, null);

            return (int.Parse(userIdStr), role);
        }

        // GET: api/Patient
        [HttpGet]
        [Authorize(Roles = "Admin,Doctor,Staff")]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatients()
        {
            var (userId, role) = GetCurrentUser();

            if (userId == null || role == null)
                return Unauthorized();

            var query = _context.Patients
                .Include(p => p.Doctor)
                .OrderByDescending(p => p.CreatedAt)
                .AsQueryable();

            //  Doctor chỉ xem bệnh nhân của mình
            if (role == "Doctor")
            {
                query = query.Where(p => p.DoctorId == userId);
            }

            return await query.ToListAsync();
        }

        // GET: api/Patient/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Doctor,Staff")]
        public async Task<ActionResult<Patient>> GetPatientById(int id)
        {
            var (userId, role) = GetCurrentUser();

            if (userId == null || role == null)
                return Unauthorized();

            var patient = await _context.Patients
                .Include(p => p.Doctor)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (patient == null)
                return NotFound(new { message = "Không tìm thấy bệnh nhân" });

            //  Doctor chỉ xem bệnh nhân của mình
            if (role == "Doctor" && patient.DoctorId != userId)
            {
                return Forbid();
            }

            return patient;
        }

        //  POST: api/Patient
        [HttpPost]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<ActionResult<Patient>> CreatePatient([FromBody] Patient patient)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (string.IsNullOrEmpty(patient.PatientCode))
            {
                patient.PatientCode = "BN" + DateTime.Now.ToString("yyMMddHHmm");
            }

            patient.CreatedAt = DateTime.Now;

            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPatientById), new { id = patient.Id }, patient);
        }

        //  PUT: api/Patient/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Doctor,Staff")]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] Patient patient)
        {
            if (id != patient.Id)
                return BadRequest(new { message = "ID không khớp" });

            var existingPatient = await _context.Patients
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);

            if (existingPatient == null)
                return NotFound();

            var (userId, role) = GetCurrentUser();

            if (userId == null || role == null)
                return Unauthorized();

            // Doctor chỉ update bệnh nhân của mình
            if (role == "Doctor" && existingPatient.DoctorId != userId)
            {
                return Forbid();
            }

            //  Staff không được đổi Doctor
            if (role == "Staff")
            {
                patient.DoctorId = existingPatient.DoctorId;
            }

            patient.CreatedAt = existingPatient.CreatedAt;
            patient.UpdatedAt = DateTime.Now;

            _context.Entry(patient).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thành công", data = patient });
        }

        // DELETE: api/Patient/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);

            if (patient == null)
                return NotFound(new { message = "Không tìm thấy bệnh nhân" });

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa bệnh nhân thành công" });
        }
    }
}