using System;
using System.Collections.Generic;

namespace FlightReservationAPI.Models;

public partial class Rol
{
    public int Id { get; set; }

    public string RolAdi { get; set; } = null!;

    public virtual ICollection<Kullanici> Kullanicis { get; set; } = new List<Kullanici>();
}
