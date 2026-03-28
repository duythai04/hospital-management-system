using hospital_backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly HospitalDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(HospitalDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User user)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);

        }
        var exisUser = _context.Users.FirstOrDefault(u => u.Email == user.Email);
        if (exisUser != null)
        {
            return BadRequest(new {message = "Email đã tồn tại"});
        }

        if (string.IsNullOrEmpty(user.Role))
        {
            user.Role = "Staff";
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Tao tài khoản thành công",
            user.Email,
            user.Role
        });
    }
    public class LoginRequest
    {
    public string Email { get; set; }
    public string Password { get; set; }
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest login)
    {
        var user = _context.Users
            .FirstOrDefault(u => u.Email == login.Email && u.Password == login.Password);

        if (user == null)
            return Unauthorized(new { message = "Sai tài khoản hoặc mật khẩu" });

        var token = GenerateJwtToken(user);

        return Ok(new
        {
            token,
            role = user.Role,
            email = user.Email
        });
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _config.GetSection("Jwt");

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSettings["Key"]));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(2),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}