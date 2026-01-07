using System;
using System.Collections.Generic;

namespace FlightReservationAPI.Models;

public partial class RezervasyonDetaylari
{
    public int Id { get; set; }

    public int? RezervasyonId { get; set; }

    public string? AdSoyad { get; set; }

    public virtual Rezervasyonlar? Rezervasyon { get; set; }
}
