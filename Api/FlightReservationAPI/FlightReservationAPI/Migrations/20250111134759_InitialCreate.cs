using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FlightReservationAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Rol",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RolAdi = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Rol__3214EC2702491D85", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Ucuslar",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KalkisSehri = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    VarisSehri = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    KalkisTarihi = table.Column<DateTime>(type: "datetime", nullable: false),
                    Fiyat = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    UcusTuru = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    KoltukSayisi = table.Column<int>(type: "int", nullable: false),
                    BosKoltukSayisi = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Ucuslar__3214EC27D660EE48", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "UcusSiniflari",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SinifAdi = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    FiyatOrani = table.Column<decimal>(type: "decimal(5,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__UcusSini__3214EC27A8BD1B9D", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Kullanici",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ad = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Soyad = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Eposta = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Sifre = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    Telefon = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    RolID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Kullanic__3214EC2764E5AB69", x => x.ID);
                    table.ForeignKey(
                        name: "FK__Kullanici__RolID__286302EC",
                        column: x => x.RolID,
                        principalTable: "Rol",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "UcusSiniflariBaglantisi",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UcusID = table.Column<int>(type: "int", nullable: false),
                    UcusSinifiID = table.Column<int>(type: "int", nullable: false),
                    SinifFiyati = table.Column<decimal>(type: "decimal(10,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__UcusSini__3214EC27E56687BF", x => x.ID);
                    table.ForeignKey(
                        name: "FK__UcusSinif__UcusI__245D67DE",
                        column: x => x.UcusID,
                        principalTable: "Ucuslar",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK__UcusSinif__UcusS__25518C17",
                        column: x => x.UcusSinifiID,
                        principalTable: "UcusSiniflari",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "Rezervasyonlar",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KullaniciID = table.Column<int>(type: "int", nullable: false),
                    UcusID = table.Column<int>(type: "int", nullable: false),
                    RezervasyonTarihi = table.Column<DateTime>(type: "datetime", nullable: false),
                    ToplamTutar = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Durum = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    YetişkinSayisi = table.Column<int>(type: "int", nullable: false),
                    CocukSayisi = table.Column<int>(type: "int", nullable: false),
                    BebekSayisi = table.Column<int>(type: "int", nullable: false),
                    UcusSinifiID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Rezervas__3214EC27CACA67A6", x => x.ID);
                    table.ForeignKey(
                        name: "FK__Rezervasy__Kulla__1F98B2C1",
                        column: x => x.KullaniciID,
                        principalTable: "Kullanici",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK__Rezervasy__UcusI__208CD6FA",
                        column: x => x.UcusID,
                        principalTable: "Ucuslar",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK__Rezervasy__UcusS__2180FB33",
                        column: x => x.UcusSinifiID,
                        principalTable: "UcusSiniflari",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "RezervasyonDetaylari",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RezervasyonID = table.Column<int>(type: "int", nullable: true),
                    AdSoyad = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Rezervas__3214EC275A470D71", x => x.ID);
                    table.ForeignKey(
                        name: "FK__Rezervasy__Rezer__282DF8C2",
                        column: x => x.RezervasyonID,
                        principalTable: "Rezervasyonlar",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Kullanici_RolID",
                table: "Kullanici",
                column: "RolID");

            migrationBuilder.CreateIndex(
                name: "UQ__Kullanic__03ABA3918430F333",
                table: "Kullanici",
                column: "Eposta",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RezervasyonDetaylari_RezervasyonID",
                table: "RezervasyonDetaylari",
                column: "RezervasyonID");

            migrationBuilder.CreateIndex(
                name: "IX_Rezervasyonlar_KullaniciID",
                table: "Rezervasyonlar",
                column: "KullaniciID");

            migrationBuilder.CreateIndex(
                name: "IX_Rezervasyonlar_UcusID",
                table: "Rezervasyonlar",
                column: "UcusID");

            migrationBuilder.CreateIndex(
                name: "IX_Rezervasyonlar_UcusSinifiID",
                table: "Rezervasyonlar",
                column: "UcusSinifiID");

            migrationBuilder.CreateIndex(
                name: "UQ__Rol__85F2635D25C128D8",
                table: "Rol",
                column: "RolAdi",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UcusSiniflariBaglantisi_UcusID",
                table: "UcusSiniflariBaglantisi",
                column: "UcusID");

            migrationBuilder.CreateIndex(
                name: "IX_UcusSiniflariBaglantisi_UcusSinifiID",
                table: "UcusSiniflariBaglantisi",
                column: "UcusSinifiID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RezervasyonDetaylari");

            migrationBuilder.DropTable(
                name: "UcusSiniflariBaglantisi");

            migrationBuilder.DropTable(
                name: "Rezervasyonlar");

            migrationBuilder.DropTable(
                name: "Kullanici");

            migrationBuilder.DropTable(
                name: "Ucuslar");

            migrationBuilder.DropTable(
                name: "UcusSiniflari");

            migrationBuilder.DropTable(
                name: "Rol");
        }
    }
}
