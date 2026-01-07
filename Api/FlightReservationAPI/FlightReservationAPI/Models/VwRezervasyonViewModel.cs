using System;
using System.Collections.Generic;

namespace FlightReservationAPI.Models;

public partial class VwRezervasyonViewModel
{
    public int Id { get; set; }

    public string KalkisSehri { get; set; } = null!;

    public string VarisSehri { get; set; } = null!;

    public int UcusSinifId { get; set; }

    public string? SinifAdi { get; set; }

    public decimal? FiyatOrani { get; set; }
}
