using Proteia.API.DTOs;

namespace Proteia.API.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDto?> LoginAsync(LoginDto loginDto);
        Task<LoginResponseDto?> RegisterAsync(RegisterDto registerDto);
        Task<bool> ValidateTokenAsync(string token);
        Task<LoginResponseDto?> RefreshTokenAsync(string refreshToken);
        Task<bool> LogoutAsync(string token);
        string GenerateJwtToken(int userId, string email, List<string> roles);
        string GenerateRefreshToken();
    }
}
