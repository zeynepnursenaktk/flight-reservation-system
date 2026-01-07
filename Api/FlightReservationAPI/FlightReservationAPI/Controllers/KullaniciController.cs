using FlightReservationAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FlightReservation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KullaniciController : ControllerBase
    {
        private readonly FlightDataBaseContext _context;

        public KullaniciController(FlightDataBaseContext context)
        {
            _context = context;
        }

        [HttpPost("KayitOl")]
        public IActionResult KayitOl([FromBody] KullaniciDto kullaniciDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    Message = "Gönderilen bilgiler eksik veya geçersiz.",
                    Errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                });
            }

            var kullanici = new Kullanici
            {
                Ad = kullaniciDto.Ad,
                Soyad = kullaniciDto.Soyad,
                Eposta = kullaniciDto.Eposta,
                Sifre = kullaniciDto.Sifre,
                Telefon = kullaniciDto.Telefon,
                RolId = 2
            };

            _context.Kullanicis.Add(kullanici);
            _context.SaveChanges();

            return Ok(new { Message = "Kullanıcı başarıyla kaydedildi." });
        }


        // POST: api/Kullanici/MusteriGiris
        [HttpPost("MusteriGiris")]
        public IActionResult MusteriGiris([FromBody] LoginRequest loginRequest)
        {
            var kullanici = _context.Kullanicis.FirstOrDefault(k =>
                k.Eposta == loginRequest.Eposta && k.Sifre == loginRequest.Sifre);

            if (kullanici == null)
                return Unauthorized(new { Message = "Hatalı giriş. Lütfen bilgilerinizi kontrol edin." });

            if (kullanici.RolId == 1)
                return Unauthorized(new { Message = "Yanlış giriş türü! Admin girişi yapamazsınız." });

            // Kullanıcı başarılı bir şekilde giriş yaptı
            return Ok(new
            {
                Message = "Giriş başarılı.",
                Kullanici = new
                {
                    kullanici.Id,
                    kullanici.Ad,
                    kullanici.Eposta,
                    Rol = "Musteri"
                }
            });
        }

        // POST: api/Kullanici/AdminGiris
        [HttpPost("AdminGiris")]
        public IActionResult AdminGiris([FromBody] LoginRequest loginRequest)
        {
            var kullanici = _context.Kullanicis.FirstOrDefault(k =>
                k.Eposta == loginRequest.Eposta && k.Sifre == loginRequest.Sifre);

            if (kullanici == null)
                return Unauthorized(new { Message = "Hatalı giriş. Lütfen bilgilerinizi kontrol edin." });

            if (kullanici.RolId == 2)
                return Unauthorized(new { Message = "Yanlış giriş türü! Müşteri girişi yapamazsınız." });

            // Kullanıcı başarılı bir şekilde giriş yaptı
            return Ok(new
            {
                Message = "Giriş başarılı.",
                Kullanici = new
                {
                    kullanici.Id,
                    kullanici.Ad,
                    kullanici.Eposta,
                    Rol = "Admin"
                }
            });
        }

        // POST: api/Kullanici/Cikis
        [HttpPost("Cikis")]
        public IActionResult Cikis()
        {
            // Çıkış işlemi (Genelde JWT token iptali ya da client tarafında token silinir)
            return Ok(new { Message = "Çıkış başarılı." });
        }
    }

    // Login için DTO (Data Transfer Object)
    public class LoginRequest
    {
        public string Eposta { get; set; }
        public string Sifre { get; set; }
    }
}
