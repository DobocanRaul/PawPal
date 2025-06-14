using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend___PawPal.Migrations
{
    /// <inheritdoc />
    public partial class FixedCascadeDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BookingRequests_Users_SitterId",
                table: "BookingRequests");

            migrationBuilder.AddForeignKey(
                name: "FK_BookingRequests_Users_SitterId",
                table: "BookingRequests",
                column: "SitterId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BookingRequests_Users_SitterId",
                table: "BookingRequests");

            migrationBuilder.AddForeignKey(
                name: "FK_BookingRequests_Users_SitterId",
                table: "BookingRequests",
                column: "SitterId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
