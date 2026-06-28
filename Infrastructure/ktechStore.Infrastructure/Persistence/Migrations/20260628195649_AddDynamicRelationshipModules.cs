using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ktechStore.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddDynamicRelationshipModules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsForeignKey",
                table: "ModuleFields",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "RelatedTable",
                table: "ModuleFields",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsForeignKey",
                table: "ModuleFields");

            migrationBuilder.DropColumn(
                name: "RelatedTable",
                table: "ModuleFields");
        }
    }
}
