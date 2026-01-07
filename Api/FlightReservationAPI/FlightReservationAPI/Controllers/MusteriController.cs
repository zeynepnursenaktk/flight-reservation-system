using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FlightReservationAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace FlightReservationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MusteriController : ControllerBase
    {
        private readonly FlightDataBaseContext _context;

        public MusteriController(FlightDataBaseContext context)
        {
            _context = context;
        }

        // GET: api/Musteri/Bilgilerim
        [HttpGet("Bilgilerim")]
        public async Task<IActionResult> Bilgilerim([FromQuery] int userId)
        {
            if (userId <= 0)
                return BadRequest("Geçersiz kullanıcı ID.");

            var kullanici = await _context.Kullanicis.AsNoTracking()
                .FirstOrDefaultAsync(k => k.Id == userId);

            if (kullanici == null)
                return NotFound("Kullanıcı bulunamadı.");

            return Ok(new
            {
                kullanici.Id,
                kullanici.Ad,
                kullanici.Eposta,
                kullanici.Telefon
            });
        }

        // PUT: api/Musteri/Bilgilerim
        [HttpPut("Bilgilerim")]
        public async Task<IActionResult> Bilgilerim([FromQuery] int userId, [FromBody] KullaniciGuncelleModel model)
        {
            if (model == null)
                return BadRequest("Güncelleme için geçerli bir veri sağlanmadı.");

            if (string.IsNullOrEmpty(model.MevcutSifre))
                return BadRequest("Mevcut şifre gereklidir.");

            var kullanici = await _context.Kullanicis.FindAsync(userId);
            if (kullanici == null)
                return NotFound("Kullanıcı bulunamadı.");

            if (kullanici.Sifre != model.MevcutSifre)
                return BadRequest("Mevcut şifre hatalı!");

            if (!string.IsNullOrEmpty(model.Telefon))
                kullanici.Telefon = model.Telefon;

            if (!string.IsNullOrEmpty(model.YeniSifre))
                kullanici.Sifre = model.YeniSifre;

            try
            {
                _context.Entry(kullanici).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Bilgiler güncellenirken bir hata oluştu: {ex.Message}");
            }

            return Ok("Bilgileriniz başarıyla güncellendi.");
        }


        // GET: api/Musteri/Rezervasyonlarim
        [HttpGet("Rezervasyonlarim")]
        public async Task<IActionResult> Rezervasyonlarim(int userId)
        {
            try
            {
                var kullanici = await _context.Kullanicis.FindAsync(userId);
                if (kullanici == null)
                {
                    return Unauthorized("Kullanıcı bulunamadı.");
                }

                var rezervasyonlar = await _context.Rezervasyonlars
                    .Include(r => r.Ucus) 
                    .Include(r => r.UcusSinifi) 
                    .Where(r => r.KullaniciId == userId) 
                    .Select(r => new
                    {
                        r.Id,
                        r.Ucus.KalkisSehri,
                        r.Ucus.VarisSehri,
                        KalkisTarihi = r.Ucus.KalkisTarihi.ToString("yyyy-MM-dd HH:mm"),
                        r.UcusSinifi.SinifAdi,
                        r.YetişkinSayisi,
                        r.CocukSayisi,
                        r.BebekSayisi,
                        r.ToplamTutar,
                        r.Durum,
                        RezervasyonTarihi = r.RezervasyonTarihi.ToString("yyyy-MM-dd HH:mm")
                    })
                    .ToListAsync();

                if (rezervasyonlar == null || !rezervasyonlar.Any())
                {
                    return NotFound("Rezervasyon bulunamadı.");
                }

                return Ok(rezervasyonlar);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Rezervasyonlarım API Hatası: {ex.Message}");
                return StatusCode(500, "Rezervasyonlar alınırken bir hata oluştu.");
            }
        }

       
        // GET: api/UcusSiniflari
        [HttpGet("UcusSiniflari")]
        public async Task<IActionResult> UcusSiniflari()
        {
            try
            {
                var ucusSiniflari = await _context.UcusSiniflaris
                    .Select(s => new
                    {
                        Id = s.Id,
                        Ad = s.SinifAdi, 
                        Fiyat = s.FiyatOrani 
                    })
                    .ToListAsync();

                if (ucusSiniflari == null || !ucusSiniflari.Any())
                {
                    return NotFound(new { message = "Uçuş sınıfları bulunamadı." });
                }

                return Ok(ucusSiniflari);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Bir hata oluştu.", error = ex.Message });
            }
        }


        // POST: api/Musteri/DinamikUcusAra
        [HttpPost("DinamikUcusAra")]
        public async Task<ActionResult<IEnumerable<UcusDto>>> DinamikUcusAra([FromBody] UcusAramaDto aramaDto)
        {
            if (string.IsNullOrWhiteSpace(aramaDto.SearchTerm))
                return Ok(new List<UcusDto>());

            var ucuslar = await _context.Ucuslars
                .Where(u => u.KalkisSehri.Contains(aramaDto.SearchTerm) ||
                            u.VarisSehri.Contains(aramaDto.SearchTerm))
                .Select(u => new UcusDto
                {
                    Id = u.Id,
                    KalkisSehri = u.KalkisSehri,
                    VarisSehri = u.VarisSehri,
                    KalkisTarihi = u.KalkisTarihi.ToString("yyyy-MM-dd HH:mm"),
                    Fiyat = u.Fiyat,
                    UcusTuru = u.UcusTuru,
                    KoltukSayisi = u.KoltukSayisi,
                    BosKoltukSayisi = u.BosKoltukSayisi
                })
                .ToListAsync();

            return Ok(ucuslar);
        }

        [HttpPost("RezervasyonYap")]
        public async Task<IActionResult> RezervasyonYap([FromBody] RezervasyonDto rezervasyonDto)
        {
            try
            {
                if (rezervasyonDto == null)
                    return BadRequest(new { Message = "Rezervasyon verileri eksik." });

                if (rezervasyonDto.UcusSinifId <= 0)
                    return BadRequest(new { Message = "Geçersiz uçuş sınıfı." });

                if (rezervasyonDto.YetiskinSayisi < 1)
                    return BadRequest(new { Message = "Yetişkin sayısı en az 1 olmalıdır." });

                var kullanici = await _context.Kullanicis.FindAsync(rezervasyonDto.KullaniciId);
                if (kullanici == null)
                    return Unauthorized(new { Message = "Kullanıcı bulunamadı." });

                var ucus = await _context.Ucuslars.FindAsync(rezervasyonDto.UcusId);
                var ucusSinifBaglanti = await _context.UcusSiniflariBaglantisis
                    .Include(b => b.UcusSinifi)
                    .FirstOrDefaultAsync(b => b.UcusId == rezervasyonDto.UcusId && b.UcusSinifi.Id == rezervasyonDto.UcusSinifId);

                if (ucus == null)
                    return NotFound(new { Message = "Uçuş bulunamadı." });

                var mevcutRezervasyon = await _context.Rezervasyonlars
                                                        .FirstOrDefaultAsync(r =>
                                                         r.KullaniciId == rezervasyonDto.KullaniciId &&
                                                         r.UcusId == rezervasyonDto.UcusId &&
                                                         r.Durum == "Onaylandı"); // Sadece onaylanan rezervasyonları kontrol et


                if (mevcutRezervasyon != null)
                {
                    return BadRequest(new { Message = "Bu uçuş için zaten bir rezervasyonunuz bulunmaktadır." });
                }

                if (ucusSinifBaglanti == null)
                    return NotFound(new { Message = "Uçuş sınıfı bulunamadı." });

                var toplamYolcu = rezervasyonDto.YetiskinSayisi + rezervasyonDto.CocukSayisi + rezervasyonDto.BebekSayisi;
                if (ucus.BosKoltukSayisi < toplamYolcu)
                {
                    return BadRequest(new { Message = "Bu uçuş için yeterli boş koltuk bulunmamaktadır." });
                }

                var toplamTutar =
                    (rezervasyonDto.YetiskinSayisi * (ucusSinifBaglanti.SinifFiyati ?? 0m)) +
                    (rezervasyonDto.CocukSayisi * 0.5m * (ucusSinifBaglanti.SinifFiyati ?? 0m)) +
                    (rezervasyonDto.BebekSayisi * 0.25m * (ucusSinifBaglanti.SinifFiyati ?? 0m));

                var rezervasyon = new Rezervasyonlar
                {
                    KullaniciId = rezervasyonDto.KullaniciId,
                    UcusId = rezervasyonDto.UcusId,
                    RezervasyonTarihi = DateTime.Now,
                    UcusSinifiId = rezervasyonDto.UcusSinifId,
                    YetişkinSayisi = rezervasyonDto.YetiskinSayisi,
                    CocukSayisi = rezervasyonDto.CocukSayisi,
                    BebekSayisi = rezervasyonDto.BebekSayisi,
                    ToplamTutar = toplamTutar,
                    Durum = "Onaylandı"
                };

                ucus.BosKoltukSayisi -= toplamYolcu;
                _context.Rezervasyonlars.Add(rezervasyon);

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Rezervasyon başarıyla tamamlandı.",
                    ToplamTutar = toplamTutar
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Rezervasyon yapma hatası: {ex.Message}");
                return StatusCode(500, new { Message = "Bir hata oluştu.", Error = ex.Message });
            }
        }




        [HttpGet("RezervasyonDetay/{id}")]
        public IActionResult RezervasyonDetay(int id)
        {
            try
            {
                var rezervasyon = _context.Rezervasyonlars
                    .Include(r => r.Ucus)
                    .Include(r => r.UcusSinifi)
                    .FirstOrDefault(r => r.Id == id);

                if (rezervasyon == null)
                    return NotFound("Rezervasyon bulunamadı.");

                return Ok(new
                {
                    Id = rezervasyon.Id,
                    Durum = rezervasyon.Durum,
                    ToplamTutar = rezervasyon.ToplamTutar,
                    KalkisSehri = rezervasyon.Ucus.KalkisSehri,
                    VarisSehri = rezervasyon.Ucus.VarisSehri,
                    KalkisTarihi = rezervasyon.Ucus.KalkisTarihi,
                    UcusSinifi = rezervasyon.UcusSinifi.SinifAdi,

                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hata: {ex.Message}");
                return StatusCode(500, "Bir hata oluştu.");
            }
        }




        // POST: api/Musteri/RezervasyonIptal
        [HttpPost("RezervasyonIptal")]
        public async Task<IActionResult> RezervasyonIptal([FromBody] RezervasyonIptalDto iptalDto)
        {
            try
            {
                var rezervasyon = await _context.Rezervasyonlars
                    .Include(r => r.Ucus)
                    .FirstOrDefaultAsync(r => r.Id == iptalDto.RezervasyonId);

                if (rezervasyon == null)
                    return NotFound(new { Message = "Rezervasyon bulunamadı." });

                if (rezervasyon.Durum == "İptal Edildi")
                    return BadRequest(new { Message = "Rezervasyon zaten iptal edilmiş." });

                rezervasyon.Durum = "İptal Edildi";
                rezervasyon.Ucus.BosKoltukSayisi += rezervasyon.YetişkinSayisi + rezervasyon.CocukSayisi + rezervasyon.BebekSayisi;

                _context.Entry(rezervasyon).State = EntityState.Modified;
                _context.Entry(rezervasyon.Ucus).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Rezervasyon başarıyla iptal edildi." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Bir hata oluştu.", Error = ex.Message });
            }
        }
    }
    public class UcusAramaDto
    {
        public string SearchTerm { get; set; }
    }

    public class UcusDto
    {
        public int Id { get; set; }
        public string KalkisSehri { get; set; }
        public string VarisSehri { get; set; }
        public string KalkisTarihi { get; set; }
        public decimal Fiyat { get; set; }
        public string UcusTuru { get; set; }
        public int KoltukSayisi { get; set; }
        public int BosKoltukSayisi { get; set; }
    }

    public class KullaniciGuncelleModel
    {
        public string Telefon { get; set; }
        public string MevcutSifre { get; set; }
        public string YeniSifre { get; set; }
    }

    public class RezervasyonDto
    {
        public int KullaniciId { get; set; }
        public int UcusId { get; set; }
        public int UcusSinifId { get; set; }
        public int YetiskinSayisi { get; set; }
        public int CocukSayisi { get; set; }
        public int BebekSayisi { get; set; }
        public List<string> AdSoyadListesi { get; set; } // Yolcuların ad-soyad bilgileri
    }



    public class RezervasyonDetayDto
    {
        public int Id { get; set; }
        public string KullaniciAdi { get; set; }
        public string KalkisSehri { get; set; }
        public string VarisSehri { get; set; }
        public DateTime KalkisTarihi { get; set; }
        public string UcusSinifi { get; set; }
        public decimal ToplamTutar { get; set; }
        public string Durum { get; set; }
    }

    public class RezervasyonIptalDto
    {
        public int RezervasyonId { get; set; }
    }


}
