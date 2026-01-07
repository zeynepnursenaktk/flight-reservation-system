using System;
using System.Collections.Generic;

namespace FlightReservationAPI.Models;

public partial class Ucuslar
{
    public int Id { get; set; }

    public string KalkisSehri { get; set; } = null!;

    public string VarisSehri { get; set; } = null!;

    public DateTime KalkisTarihi { get; set; }

    public decimal Fiyat { get; set; }

    public string UcusTuru { get; set; } = null!;

    public int KoltukSayisi { get; set; }

    public int BosKoltukSayisi { get; set; }

    public virtual ICollection<Rezervasyonlar> Rezervasyonlars { get; set; } = new List<Rezervasyonlar>();

    public virtual ICollection<UcusSiniflariBaglantisi> UcusSiniflariBaglantisis { get; set; } = new List<UcusSiniflariBaglantisi>();
}
