using System;
using System.Collections.Generic;

namespace FlightReservationAPI.Models;

public partial class UcusSiniflariBaglantisi
{
    public int Id { get; set; }

    public int UcusId { get; set; }

    public int UcusSinifiId { get; set; }

    public decimal? SinifFiyati { get; set; }

    public virtual Ucuslar Ucus { get; set; } = null!;

    public virtual UcusSiniflari UcusSinifi { get; set; } = null!;
}
