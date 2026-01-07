using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FlightReservationAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlightReservationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly FlightDataBaseContext _context;

        public AdminController(FlightDataBaseContext context)
        {
            _context = context;
        }

        


        [HttpPost("UcusEkle")]
        public async Task<IActionResult> UcusEkle([FromBody] Ucuslar model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            model.BosKoltukSayisi = model.KoltukSayisi;
            _context.Ucuslars.Add(model);
            await _context.SaveChangesAsync();

            var ucusSiniflari = await _context.UcusSiniflaris.ToListAsync();
            foreach (var sinif in ucusSiniflari)
            {
                var sinifBaglanti = new UcusSiniflariBaglantisi
                {
                    UcusId = model.Id,
                    UcusSinifiId = sinif.Id,
                    SinifFiyati = model.Fiyat * sinif.FiyatOrani
                };
                _context.UcusSiniflariBaglantisis.Add(sinifBaglanti);
            }

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Uçuş ve uçuş sınıfları başarıyla eklendi." });
        }



        // PUT: api/Admin/UcusDuzenle/{id}
        [HttpPut("UcusDuzenle/{id}")]
        public async Task<IActionResult> UcusDuzenle(int id, [FromBody] Ucuslar model)
        {
            if (id != model.Id)
                return BadRequest("ID uyuşmuyor.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Entry(model).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok("Uçuş başarıyla güncellendi.");
        }

        // GET: api/Admin/UcusSiniflari
        [HttpGet("UcusSiniflari")]
        public async Task<IActionResult> GetUcusSiniflari()
        {
            var ucusSiniflari = await _context.UcusSiniflaris
                .Select(sinif => new
                {
                    sinif.Id,
                    sinif.SinifAdi,
                    sinif.FiyatOrani
                })
                .ToListAsync();

            return Ok(ucusSiniflari);
        }


        // GET: api/Admin/UcakDetaylari
        [HttpGet("UcakDetaylari")]
        public async Task<IActionResult> UcakDetaylari()
        {
            var ucuslar = await _context.Ucuslars.ToListAsync();
            return Ok(ucuslar);
        }

        // DELETE: api/Admin/SilVeOnayla/{id}
        [HttpDelete("SilVeOnayla/{id}")]
        public async Task<IActionResult> SilVeOnayla(int id)
        {
            var ucus = await _context.Ucuslars
                .Include(u => u.Rezervasyonlars)
                .Include(u => u.UcusSiniflariBaglantisis)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (ucus == null)
                return NotFound("Uçuş bulunamadı.");

            foreach (var rezervasyon in ucus.Rezervasyonlars.ToList())
            {
                _context.RezervasyonDetaylaris.RemoveRange(
                    _context.RezervasyonDetaylaris.Where(d => d.RezervasyonId == rezervasyon.Id));
                _context.Rezervasyonlars.Remove(rezervasyon);
            }

            _context.UcusSiniflariBaglantisis.RemoveRange(ucus.UcusSiniflariBaglantisis);
            _context.Ucuslars.Remove(ucus);

            await _context.SaveChangesAsync();
            return Ok("Uçuş ve ilişkili tüm veriler başarıyla silindi.");
        }

        // GET: api/Admin/KullaniciListesi
        [HttpGet("KullaniciListesi")]
        public async Task<IActionResult> KullaniciListesi()
        {
            var kullanicilar = await _context.Kullanicis
                .Where(k => k.Rol.RolAdi == "Musteri")
                .ToListAsync();

            return Ok(kullanicilar);
        }

        // DELETE: api/Admin/KullaniciSil/{id}
        [HttpDelete("KullaniciSil/{id}")]
        public async Task<IActionResult> KullaniciSil(int id)
        {
            var kullanici = await _context.Kullanicis
                .Include(k => k.Rezervasyonlars) 
                    .ThenInclude(r => r.Ucus)    
                .Include(k => k.Rezervasyonlars)
                    .ThenInclude(r => r.RezervasyonDetaylaris) 
                .FirstOrDefaultAsync(k => k.Id == id);

            if (kullanici == null)
                return NotFound("Kullanıcı bulunamadı.");

            foreach (var rezervasyon in kullanici.Rezervasyonlars.ToList())
            {
                var ucus = rezervasyon.Ucus;
                if (ucus != null)
                {
                    ucus.BosKoltukSayisi += rezervasyon.YetişkinSayisi + rezervasyon.CocukSayisi + rezervasyon.BebekSayisi;
                }

                _context.RezervasyonDetaylaris.RemoveRange(rezervasyon.RezervasyonDetaylaris);
                _context.Rezervasyonlars.Remove(rezervasyon);
            }

            _context.Kullanicis.Remove(kullanici);
            await _context.SaveChangesAsync();

            return Ok("Kullanıcı ve ilişkili tüm veriler başarıyla silindi.");
        }


        [HttpGet("Rezervasyonlar")]
        public async Task<IActionResult> Rezervasyonlar()
        {
            var rezervasyonlar = await _context.Rezervasyonlars
                .Include(r => r.Kullanici)
                .Include(r => r.Ucus)
                .Select(r => new
                {
                    Id = r.Id,
                    KullaniciAdi = r.Kullanici.Ad + " " + r.Kullanici.Soyad,
                    UcusAdi = r.Ucus.KalkisSehri + " - " + r.Ucus.VarisSehri,
                    RezervasyonTarihi = r.RezervasyonTarihi,
                    ToplamTutar = r.ToplamTutar
                })
                .ToListAsync();

            return Ok(rezervasyonlar);
        }

        [HttpGet("RezervasyonDetay/{id}")]
        public async Task<IActionResult> RezervasyonDetay(int id)
        {
            var rezervasyon = await _context.Rezervasyonlars
                .Include(r => r.Kullanici)
                .Include(r => r.Ucus)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (rezervasyon == null)
                return NotFound();

            var detay = new
            {
                Id = rezervasyon.Id,
                KullaniciAdi = rezervasyon.Kullanici.Ad + " " + rezervasyon.Kullanici.Soyad,
                UcusAdi = rezervasyon.Ucus.KalkisSehri + " - " + rezervasyon.Ucus.VarisSehri,
                RezervasyonTarihi = rezervasyon.RezervasyonTarihi,
                ToplamTutar = rezervasyon.ToplamTutar,
                YetiskinSayisi = rezervasyon.YetişkinSayisi,
                CocukSayisi = rezervasyon.CocukSayisi,
                BebekSayisi = rezervasyon.BebekSayisi
            };

            return Ok(detay);
        }



    }
}
