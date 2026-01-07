using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace FlightReservationAPI.Models;

public partial class FlightDataBaseContext : DbContext
{
    public FlightDataBaseContext()
    {
    }

    public FlightDataBaseContext(DbContextOptions<FlightDataBaseContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Kullanici> Kullanicis { get; set; }

    public virtual DbSet<RezervasyonDetaylari> RezervasyonDetaylaris { get; set; }

    public virtual DbSet<Rezervasyonlar> Rezervasyonlars { get; set; }

    public virtual DbSet<Rol> Rols { get; set; }

    public virtual DbSet<UcusSiniflari> UcusSiniflaris { get; set; }

    public virtual DbSet<UcusSiniflariBaglantisi> UcusSiniflariBaglantisis { get; set; }

    public virtual DbSet<Ucuslar> Ucuslars { get; set; }

    public virtual DbSet<VwRezervasyonViewModel> VwRezervasyonViewModels { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=FlightDataBase;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Kullanici>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Kullanic__3214EC2764E5AB69");

            entity.ToTable("Kullanici");

            entity.HasIndex(e => e.Eposta, "UQ__Kullanic__03ABA3918430F333").IsUnique();

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Ad)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Eposta)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.RolId).HasColumnName("RolID");
            entity.Property(e => e.Sifre)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Soyad)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Telefon)
                .HasMaxLength(15)
                .IsUnicode(false);

            entity.HasOne(d => d.Rol).WithMany(p => p.Kullanicis)
                .HasForeignKey(d => d.RolId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Kullanici__RolID__286302EC");
        });

        modelBuilder.Entity<RezervasyonDetaylari>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Rezervas__3214EC275A470D71");

            entity.ToTable("RezervasyonDetaylari");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.AdSoyad).HasMaxLength(100);
            entity.Property(e => e.RezervasyonId).HasColumnName("RezervasyonID");

            entity.HasOne(d => d.Rezervasyon).WithMany(p => p.RezervasyonDetaylaris)
                .HasForeignKey(d => d.RezervasyonId)
                .HasConstraintName("FK__Rezervasy__Rezer__282DF8C2");
        });

        modelBuilder.Entity<Rezervasyonlar>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Rezervas__3214EC27CACA67A6");

            entity.ToTable("Rezervasyonlar");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Durum).HasMaxLength(50);
            entity.Property(e => e.KullaniciId).HasColumnName("KullaniciID");
            entity.Property(e => e.RezervasyonTarihi).HasColumnType("datetime");
            entity.Property(e => e.ToplamTutar).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.UcusId).HasColumnName("UcusID");
            entity.Property(e => e.UcusSinifiId).HasColumnName("UcusSinifiID");

            entity.HasOne(d => d.Kullanici).WithMany(p => p.Rezervasyonlars)
                .HasForeignKey(d => d.KullaniciId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Rezervasy__Kulla__1F98B2C1");

            entity.HasOne(d => d.Ucus).WithMany(p => p.Rezervasyonlars)
                .HasForeignKey(d => d.UcusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Rezervasy__UcusI__208CD6FA");

            entity.HasOne(d => d.UcusSinifi).WithMany(p => p.Rezervasyonlars)
                .HasForeignKey(d => d.UcusSinifiId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Rezervasy__UcusS__2180FB33");
        });

        modelBuilder.Entity<Rol>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Rol__3214EC2702491D85");

            entity.ToTable("Rol");

            entity.HasIndex(e => e.RolAdi, "UQ__Rol__85F2635D25C128D8").IsUnique();

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.RolAdi)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<UcusSiniflari>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__UcusSini__3214EC27A8BD1B9D");

            entity.ToTable("UcusSiniflari");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.FiyatOrani).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.SinifAdi).HasMaxLength(50);
        });

        modelBuilder.Entity<UcusSiniflariBaglantisi>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__UcusSini__3214EC27E56687BF");

            entity.ToTable("UcusSiniflariBaglantisi");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.SinifFiyati).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.UcusId).HasColumnName("UcusID");
            entity.Property(e => e.UcusSinifiId).HasColumnName("UcusSinifiID");

            entity.HasOne(d => d.Ucus).WithMany(p => p.UcusSiniflariBaglantisis)
                .HasForeignKey(d => d.UcusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UcusSinif__UcusI__245D67DE");

            entity.HasOne(d => d.UcusSinifi).WithMany(p => p.UcusSiniflariBaglantisis)
                .HasForeignKey(d => d.UcusSinifiId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UcusSinif__UcusS__25518C17");
        });

        modelBuilder.Entity<Ucuslar>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Ucuslar__3214EC27D660EE48");

            entity.ToTable("Ucuslar");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Fiyat).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.KalkisSehri).HasMaxLength(50);
            entity.Property(e => e.KalkisTarihi).HasColumnType("datetime");
            entity.Property(e => e.UcusTuru).HasMaxLength(20);
            entity.Property(e => e.VarisSehri).HasMaxLength(50);
        });

        modelBuilder.Entity<VwRezervasyonViewModel>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_RezervasyonViewModel");

            entity.Property(e => e.FiyatOrani).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.KalkisSehri).HasMaxLength(50);
            entity.Property(e => e.SinifAdi).HasMaxLength(50);
            entity.Property(e => e.VarisSehri).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
