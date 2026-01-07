using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace FlightReservationAPI.Models;

public partial class Kullanici
{
    public int Id { get; set; }

    public string Ad { get; set; } = null!;

    public string Soyad { get; set; } = null!;

    public string Eposta { get; set; } = null!;

    public string Sifre { get; set; } = null!;

    public string? Telefon { get; set; }

    public int RolId { get; set; }

    [JsonIgnore] // Bu alan API'de JSON'dan beklenmeyecek
    public Rol Rol { get; set; } // Navigation property

    [JsonIgnore] // Bu alan API'de JSON'dan beklenmeyecek
    public ICollection<Rezervasyonlar> Rezervasyonlars { get; set; }
}
