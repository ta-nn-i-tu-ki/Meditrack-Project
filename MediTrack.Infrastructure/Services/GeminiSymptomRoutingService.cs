using System.Net.Http.Json;
using System.Text.Json;
using MediTrack.Application.Interfaces;
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
}
