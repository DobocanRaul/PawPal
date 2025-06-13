using Backend___PawPal.Context;
using Backend___PawPal.Models;
using Microsoft.AspNetCore.SignalR;

namespace Backend___PawPal.Hubs;

public class ChatHub : Hub
{

    private readonly PawPalDbContext _context;

    public ChatHub(PawPalDbContext context)
    {
        this._context = context;
    }
    public async Task JoinChat(UserConnection conn) {
        await Clients.All.SendAsync("ReceiveMessage", "admin", $"{conn.UserId} has joined");
    }

    public async Task JoinSpecificChat(UserConnection conn) {
        await Groups.AddToGroupAsync(Context.ConnectionId, conn.ChatName);
        await Clients.Group(conn.ChatName).SendAsync("JoinSpecificChat", "admin", $"{conn.UserId} has joined {conn.ChatName}");
    }

    public async Task SendMessage(string user, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }

    public async Task SendSpecificMessage(Guid senderId,Guid receiverId, string message, string chatId)
     {
        await Clients.Group(chatId).SendAsync("ReceiveSpecificMessage", senderId, message);
        Message newMessage = new Message();
        newMessage.SenderId = senderId;
        newMessage.ReceiverId = receiverId;
        newMessage.Id = new Guid();
        newMessage.Msg = message;
        newMessage.DateTimeSent = DateTime.Now;

        await _context.Messages.AddAsync(newMessage);
        await _context.SaveChangesAsync();


    }
}
