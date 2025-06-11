using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend___PawPal.Migrations
{
    /// <inheritdoc />
    public partial class AddedNORatingsonuserentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NumberOfRatings",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumberOfRatings",
                table: "Users");
        }
    }
}
