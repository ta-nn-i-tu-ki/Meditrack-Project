using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using MediTrack.Application.Interfaces;
using MediTrack.Application.Symptoms.Commands;
using Microsoft.Extensions.Configuration;

namespace MediTrack.Infrastructure.Services;

public class GeminiSymptomRoutingService : IAiSymptomRoutingService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private const string ApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    public GeminiSymptomRoutingService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration.GetSection("GeminiAi")["ApiKey"] 
                  ?? throw new InvalidOperationException("Gemini API key is not configured.");
    }

    public async Task<string> AnalyzeSymptomsAsync(string symptoms, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_apiKey) || _apiKey == "YOUR_GEMINI_API_KEY")
        {
            await Task.Delay(1000, cancellationToken);
            return "Based on your symptoms, I recommend visiting the General Medicine department.";
        }

        var requestUrl = $"{ApiUrl}?key={_apiKey}";

        var prompt = $"Analyze the following patient symptoms and recommend the most suitable medical department (e.g., Cardiology, Neurology, Orthopedics, General, etc.) and give a brief reasoning. Symptoms: {symptoms}";

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = prompt }
                    }
                }
            }
        };

        var response = await _httpClient.PostAsJsonAsync(requestUrl, requestBody, cancellationToken);
        
        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new Exception($"Failed to analyze symptoms via AI: {error}");
        }

        var jsonDoc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync(cancellationToken), cancellationToken: cancellationToken);
        
        try
        {
            var textResult = jsonDoc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            return textResult ?? "Analysis unavailable.";
        }
        catch (KeyNotFoundException)
        {
            return "Failed to parse AI response.";
        }
    }

    public async Task<string> ConductConsultationAsync(List<ChatMessage> history, PatientVitals vitals, string newMessage, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_apiKey) || _apiKey == "YOUR_GEMINI_API_KEY")
        {
            await Task.Delay(1500, cancellationToken);
            
            if (history.Count < 3)
            {
                return "I understand your symptoms. Could you please tell me how long you've been experiencing this?";
            }

            return @"Based on your symptoms and vitals, I recommend a checkup with a General Physician. I have generated a provisional prescription for you.

```json
{
  ""recommendedDepartment"": ""General Medicine"",
  ""suggestedDoctor"": ""Dr. Sarah Jenkins"",
  ""medicines"": [
    { ""name"": ""Paracetamol"", ""dosage"": ""500mg"", ""duration"": ""3 days"" },
    { ""name"": ""Vitamin C"", ""dosage"": ""1000mg"", ""duration"": ""5 days"" }
  ],
  ""notes"": ""Get plenty of rest and stay hydrated.""
}
```";
        }

        var requestUrl = $"{ApiUrl}?key={_apiKey}";

        var systemPrompt = @"You are Dr. AI, an expert, empathetic virtual physician.
You are currently talking to a patient.
Your goal is to understand their symptoms, ask clarifying questions if needed, and eventually provide a provisional diagnosis, recommend a specialist, and suggest provisional medication if appropriate.
Important: Always maintain a professional, caring tone.
At the end of the consultation, if you have enough information, you may output a JSON block wrapped in ```json ... ``` with this format:
{
  ""recommendedDepartment"": ""Cardiology"",
  ""suggestedDoctor"": ""Dr. Smith"",
  ""medicines"": [
    { ""name"": ""Paracetamol"", ""dosage"": ""500mg"", ""duration"": ""3 days"" }
  ],
  ""notes"": ""Drink plenty of water.""
}
If you do not have enough info yet, just respond conversationally.";

        var contents = new List<object>();

        // Add System Prompt and Vitals
        var vitalsInfo = $"Current Vitals - BP: {vitals.BloodPressure}, HR: {vitals.HeartRate}, Temp: {vitals.Temperature}";
        contents.Add(new { role = "user", parts = new[] { new { text = systemPrompt + "\n\n" + vitalsInfo } } });
        contents.Add(new { role = "model", parts = new[] { new { text = "Understood. I will act as Dr. AI." } } });

        // Add History
        foreach (var msg in history)
        {
            contents.Add(new { role = msg.Role, parts = new[] { new { text = msg.Content } } });
        }

        // Add New Message
        contents.Add(new { role = "user", parts = new[] { new { text = newMessage } } });

        var requestBody = new { contents };

        var response = await _httpClient.PostAsJsonAsync(requestUrl, requestBody, cancellationToken);
        
        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new Exception($"Failed to conduct AI consultation: {error}");
        }

        var jsonDoc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync(cancellationToken), cancellationToken: cancellationToken);
        
        try
        {
            var textResult = jsonDoc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            return textResult ?? "Analysis unavailable.";
        }
        catch (KeyNotFoundException)
        {
            return "Failed to parse AI response.";
        }
    }
}
