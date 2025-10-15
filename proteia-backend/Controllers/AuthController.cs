using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Proteia.API.DTOs;
using Proteia.API.Services;

namespace Proteia.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// Autenticar usuario y obtener token JWT
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _authService.LoginAsync(loginDto);
                
                if (result == null)
                {
                    return Unauthorized(new { message = "Credenciales inválidas" });
                }

                _logger.LogInformation("User {Email} logged in successfully", loginDto.Email);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for {Email}", loginDto.Email);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Registrar nuevo usuario
        /// </summary>
        [HttpPost("register")]
        public async Task<ActionResult<LoginResponseDto>> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _authService.RegisterAsync(registerDto);
                
                if (result == null)
                {
                    return BadRequest(new { message = "El email ya está registrado o ocurrió un error" });
                }

                _logger.LogInformation("User {Email} registered successfully", registerDto.Email);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration for {Email}", registerDto.Email);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Renovar token usando refresh token
        /// </summary>
        [HttpPost("refresh")]
        public async Task<ActionResult<LoginResponseDto>> RefreshToken([FromBody] RefreshTokenDto refreshTokenDto)
        {
            try
            {
                var result = await _authService.RefreshTokenAsync(refreshTokenDto.RefreshToken);
                
                if (result == null)
                {
                    return Unauthorized(new { message = "Refresh token inválido o expirado" });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token refresh");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Cerrar sesión del usuario
        /// </summary>
        [HttpPost("logout")]
        [Authorize]
        public async Task<ActionResult> Logout()
        {
            try
            {
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                
                if (string.IsNullOrEmpty(token))
                {
                    return BadRequest(new { message = "Token no proporcionado" });
                }

                var result = await _authService.LogoutAsync(token);
                
                if (result)
                {
                    return Ok(new { message = "Sesión cerrada exitosamente" });
                }
                
                return BadRequest(new { message = "Error al cerrar sesión" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Validar token actual
        /// </summary>
        [HttpGet("validate")]
        [Authorize]
        public async Task<ActionResult> ValidateToken()
        {
            try
            {
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                
                if (string.IsNullOrEmpty(token))
                {
                    return Unauthorized(new { message = "Token no proporcionado" });
                }

                var isValid = await _authService.ValidateTokenAsync(token);
                
                if (isValid)
                {
                    return Ok(new { message = "Token válido", valid = true });
                }
                
                return Unauthorized(new { message = "Token inválido", valid = false });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating token");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }
    }

    public class RefreshTokenDto
    {
        public string RefreshToken { get; set; } = string.Empty;
    }
}
