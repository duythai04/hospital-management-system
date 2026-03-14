
namespace hospital_backend.Models
{
    public class Patient
    {
        public int Id {get; set; }
        public string Full_name {get; set;}

        public DateTime Dob {get; set;}
        public string Gender {get; set;}

        public string Phone {get; set;}

        public string Address {get; set;}

        public string Blood_type {get; set;}

        public DateTime Created_at {get; set;}
    }
}