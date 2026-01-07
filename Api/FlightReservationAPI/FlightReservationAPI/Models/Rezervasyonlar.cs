using System;
using System.Collections.Generic;

namespace FlightReservationAPI.Models;

public partial class Rezervasyonlar
{
    public int Id { get; set; }

    public int KullaniciId { get; set; }

    public int UcusId { get; set; }

    public DateTime RezervasyonTarihi { get; set; }

    public decimal ToplamTutar { get; set; }

    public string Durum { get; set; } = null!;

    public int YetişkinSayisi { get; set; }

    public int CocukSayisi { get; set; }

    public int BebekSayisi { get; set; }

    public int UcusSinifiId { get; set; }

    public virtual Kullanici Kullanici { get; set; } = null!;

    public virtual ICollection<RezervasyonDetaylari> RezervasyonDetaylaris { get; set; } = new List<RezervasyonDetaylari>();

    public virtual Ucuslar Ucus { get; set; } = null!;

    public virtual UcusSiniflari UcusSinifi { get; set; } = null!;
}
