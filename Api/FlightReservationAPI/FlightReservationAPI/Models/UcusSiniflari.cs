using System;
using System.Collections.Generic;

namespace FlightReservationAPI.Models;

public partial class UcusSiniflari
{
    public int Id { get; set; }

    public string? SinifAdi { get; set; }

    public decimal? FiyatOrani { get; set; }

    public virtual ICollection<Rezervasyonlar> Rezervasyonlars { get; set; } = new List<Rezervasyonlar>();

    public virtual ICollection<UcusSiniflariBaglantisi> UcusSiniflariBaglantisis { get; set; } = new List<UcusSiniflariBaglantisi>();
}
