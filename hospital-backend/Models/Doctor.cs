using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hospital_backend.Models
{
    public class Doctor
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int EmployeeId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        public string Address { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string Phone { get; set; }

        public string Gender { get; set; }

        [Column(TypeName = "date")]
        public DateTime Bod { get; set; } // Date of Birth

        public string Department { get; set; } // Ví dụ: Outpatient department (OPD)

        public string Specialist { get; set; } // Chuyên khoa

        public string BloodGroup { get; set; } // Ví dụ: AB+

        public string Designation { get; set; } // Ví dụ: MBBS

        public string Biography { get; set; } // Tiểu sử

        public bool IsActive { get; set; } = true; // Status: Active/Inactive

        public string ImageUrl { get; set; } // Đường dẫn ảnh đại diện
        
        // Social Media links (nếu cần quản lý như trong ảnh)
        public string FacebookUrl { get; set; }
        public string TwitterUrl { get; set; }


        public List<Patient> Patients {get; set;}
    }
}