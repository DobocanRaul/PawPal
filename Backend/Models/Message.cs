namespace Backend___PawPal.Models;

public class Message
{
    public Guid Id { get; set; }
    public Guid SenderId { get; set; }
    public User Sender { get; set; }
    public Guid ReceiverId { get; set; }
    public User Receiver { get; set; }
    public DateTime DateTimeSent { get; set; }
    public string Msg { get; set; }
}
