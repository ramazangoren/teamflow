using System.Text.Json.Serialization;

public class UpdateUserRequest
{
    public string FullName { get; set; }

    [JsonPropertyName("gender")]
    public string? Gender { get; set; }
    public string? DateOfBirth { get; set; }
    public string? PhoneNumber { get; set; }
    public DateTime UpdatedAt { get; set; }
}