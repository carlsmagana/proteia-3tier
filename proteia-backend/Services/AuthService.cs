using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Proteia.API.Data;
using Proteia.API.DTOs;
using Proteia.API.Models;

namespace Proteia.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly ProteiaDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;

        public AuthService(ProteiaDbContext context, IConfiguration configuration, ILogger<AuthService> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginDto loginDto)
        {
            try
            {
                // Buscar usuario por email
                var user = await _context.Users
                    .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                    .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

                if (user == null)
                {
                    _logger.LogWarning("Login failed - User not found for email: {Email}", loginDto.Email);
                    return null;
                }

                if (user.Password != loginDto.Password)
                {
                    _logger.LogWarning("Login failed - Password mismatch for email: {Email}. Expected: '{Expected}', Received: '{Received}'", 
                        loginDto.Email, user.Password, loginDto.Password);
                    return null;
                }

                // Obtener roles del usuario
                var roles = user.UserRoles.Select(ur => ur.Role.RoleName).ToList();

                // Generar tokens
                var token = GenerateJwtToken(user.IdUser, user.Email!, roles);
                var refreshToken = GenerateRefreshToken();
                var expiresAt = DateTime.UtcNow.AddHours(8); // 8 horas de duración

                // Crear sesión
                var session = new UserSession
                {
                    UserId = user.IdUser,
                    SessionToken = token,
                    RefreshToken = refreshToken,
                    ExpiresAt = expiresAt,
                    IsActive = true
                };

                _context.UserSessions.Add(session);
                await _context.SaveChangesAsync();

                return new LoginResponseDto
                {
                    UserId = user.IdUser,
                    Name = user.NameUser ?? "",
                    Email = user.Email ?? "",
                    Token = token,
                    RefreshToken = refreshToken,
                    ExpiresAt = expiresAt,
                    Roles = roles
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for email: {Email}", loginDto.Email);
                return null;
            }
        }

        public async Task<LoginResponseDto?> RegisterAsync(RegisterDto registerDto)
        {
            try
            {
                // Verificar si el email ya existe
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == registerDto.Email);

                if (existingUser != null)
                {
                    _logger.LogWarning("Registration failed - Email already exists: {Email}", registerDto.Email);
                    return null;
                }

                // Crear nuevo usuario
                var newUser = new User
                {
                    NameUser = registerDto.Name,
                    Email = registerDto.Email,
                    Password = registerDto.Password // En producción, hashear la contraseña
                };

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                // Asignar rol por defecto (Viewer)
                var viewerRole = await _context.Roles
                    .FirstOrDefaultAsync(r => r.RoleName == "Viewer");

                if (viewerRole != null)
                {
                    var userRole = new UserRole
                    {
                        UserId = newUser.IdUser,
                        RoleId = viewerRole.Id,
                        AssignedAt = DateTime.UtcNow
                    };

                    _context.UserRoles.Add(userRole);
                    await _context.SaveChangesAsync();
                }

                _logger.LogInformation("User registered successfully: {Email}", registerDto.Email);

                // Generar token para el nuevo usuario
                var roles = new List<string> { "Viewer" };
                var token = GenerateJwtToken(newUser.IdUser, newUser.Email, roles);
                var refreshToken = GenerateRefreshToken();
                var expiresAt = DateTime.UtcNow.AddHours(8);

                // Crear sesión
                var session = new UserSession
                {
                    UserId = newUser.IdUser,
                    SessionToken = token,
                    RefreshToken = refreshToken,
                    ExpiresAt = expiresAt,
                    CreatedAt = DateTime.UtcNow,
                    LastActivity = DateTime.UtcNow,
                    IsActive = true
                };

                _context.UserSessions.Add(session);
                await _context.SaveChangesAsync();

                return new LoginResponseDto
                {
                    UserId = newUser.IdUser,
                    Name = newUser.NameUser ?? "",
                    Email = newUser.Email ?? "",
                    Token = token,
                    RefreshToken = refreshToken,
                    ExpiresAt = expiresAt,
                    Roles = roles
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration for email: {Email}", registerDto.Email);
                return null;
            }
        }

        public async Task<bool> ValidateTokenAsync(string token)
        {
            try
            {
                var session = await _context.UserSessions
                    .FirstOrDefaultAsync(s => s.SessionToken == token && s.IsActive && s.ExpiresAt > DateTime.UtcNow);

                if (session != null)
                {
                    // Actualizar última actividad
                    session.LastActivity = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating token");
                return false;
            }
        }

        public async Task<LoginResponseDto?> RefreshTokenAsync(string refreshToken)
        {
            try
            {
                var session = await _context.UserSessions
                    .Include(s => s.User)
                    .ThenInclude(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                    .FirstOrDefaultAsync(s => s.RefreshToken == refreshToken && s.IsActive);

                if (session == null || session.ExpiresAt <= DateTime.UtcNow)
                {
                    return null;
                }

                var user = session.User;
                var roles = user.UserRoles.Select(ur => ur.Role.RoleName).ToList();

                // Generar nuevos tokens
                var newToken = GenerateJwtToken(user.IdUser, user.Email!, roles);
                var newRefreshToken = GenerateRefreshToken();
                var newExpiresAt = DateTime.UtcNow.AddHours(8);

                // Actualizar sesión
                session.SessionToken = newToken;
                session.RefreshToken = newRefreshToken;
                session.ExpiresAt = newExpiresAt;
                session.LastActivity = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return new LoginResponseDto
                {
                    UserId = user.IdUser,
                    Name = user.NameUser ?? "",
                    Email = user.Email ?? "",
                    Token = newToken,
                    RefreshToken = newRefreshToken,
                    ExpiresAt = newExpiresAt,
                    Roles = roles
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error refreshing token");
                return null;
            }
        }

        public async Task<bool> LogoutAsync(string token)
        {
            try
            {
                var session = await _context.UserSessions
                    .FirstOrDefaultAsync(s => s.SessionToken == token);

                if (session != null)
                {
                    session.IsActive = false;
                    await _context.SaveChangesAsync();
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout");
                return false;
            }
        }

        public string GenerateJwtToken(int userId, string email, List<string> roles)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = Encoding.ASCII.GetBytes(jwtSettings["SecretKey"]!);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Email, email),
                new Claim("userId", userId.ToString())
            };

            // Agregar roles como claims
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(8),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}
