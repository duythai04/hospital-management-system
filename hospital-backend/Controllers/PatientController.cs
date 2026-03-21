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

        // GET: api/Patient
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatients()
        {
            // Sử dụng .Include(p => p.Doctor) nếu bạn muốn lấy luôn tên bác sĩ phụ trách
            return await _context.Patients
                .Include(p => p.Doctor) 
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        // GET: api/Patient/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatientById(int id)
        {
            var patient = await _context.Patients
                .Include(p => p.Doctor)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (patient == null) return NotFound(new { message = "Không tìm thấy bệnh nhân" });
            
            return patient;
        }

        // POST: api/Patient
        [HttpPost]
        public async Task<ActionResult<Patient>> CreatePatient([FromBody] Patient patient)
        {

            if (string.IsNullOrEmpty(patient.PatientCode))
            {
                patient.PatientCode = "BN" + DateTime.Now.ToString("yyMMddHHmm");
            }
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // Đảm bảo các trường mặc định được thiết lập
            patient.CreatedAt = DateTime.Now;
            
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPatientById), new { id = patient.Id }, patient);
        }

        // PUT: api/Patient/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] Patient patient)
        {
            if (id != patient.Id) return BadRequest(new { message = "ID không khớp" });

            // Tìm bệnh nhân hiện tại trong DB để tránh mất dữ liệu CreatedAt
            var existingPatient = await _context.Patients.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
            if (existingPatient == null) return NotFound();

            // Giữ lại ngày tạo gốc và cập nhật ngày sửa
            patient.CreatedAt = existingPatient.CreatedAt;
            patient.UpdatedAt = DateTime.Now;

            _context.Entry(patient).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatientExists(id)) return NotFound();
                else throw;
            }

            return Ok(new { message = "Cập nhật thành công", data = patient });
        }

        // DELETE: api/Patient/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null) return NotFound(new { message = "Không tìm thấy bệnh nhân" });

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa bệnh nhân thành công" });
        }

        private bool PatientExists(int id)
        {
            return _context.Patients.Any(e => e.Id == id);
        }
    }
}