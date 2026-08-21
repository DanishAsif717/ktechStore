using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ktechStore.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddProdcutRejectionReason : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RejectionReason",
                table: "Products",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RejectionReason",
                table: "Products");
        }
    }
}
