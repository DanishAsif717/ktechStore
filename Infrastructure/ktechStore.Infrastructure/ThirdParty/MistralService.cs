using ktechStore.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;

namespace ktechStore.Infrastructure.ThirdParty
{
    public class MistralService : IMistralService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly ILogger<MistralService> _logger;


        public MistralService(IConfiguration configuration, ILogger<MistralService> logger)
        {
            _httpClient = new HttpClient();
            _apiKey = configuration["MistralAi:ApiKey"] ?? throw new ArgumentNullException("Mistral API Key is missing.");
            _logger = logger;
        }

        public async Task<string> GenerateDescriptionAsync(string productName, string categoryName)
        {
            var prompt = $"Generate a clean, engaging e-commerce product description under 250 characters for a product named '{productName}' inside the category '{categoryName}'.";
            return await CallMistralApiAsync(prompt, "You are a professional e-commerce copywriter.");
        }

        // 👍 SKU Generation Logic
        public async Task<string> GenerateSkuAsync(string productName, string categoryName)
        {
            var prompt = $"Create a short, standard e-commerce SKU code for Product: '{productName}' and Category: '{categoryName}'. " +
                         $"Format should be uppercase, short abbreviation of product, dash, short category name, dash, and a dynamic number. e.g., 'ARIEL-LAUND-786' or 'SONY-AUD-101'.";

            var result = await CallMistralApiAsync(prompt, "You are an inventory management expert. Return ONLY the plain SKU code string. Do NOT include spaces, periods, explanations, markdown, or extra characters. Just the raw SKU code.");

            return result.Trim().ToUpper();
        }

        private async Task<string> CallMistralApiAsync(string prompt, string systemRole)
        {
            var requestBody = new
            {
                model = "mistral-small-latest",
                messages = new[]
                {
                    new { role = "system", content = systemRole },
                    new { role = "user", content = prompt }
                },
                max_tokens = 80,
                temperature = 0.7
            };

            var requestJson = JsonSerializer.Serialize(requestBody);

            // 🔥 Request bhejne se pehle log karo
            _logger.LogInformation("Mistral API request sent. Prompt: {Prompt}", prompt);

            try
            {
                var request = new HttpRequestMessage(HttpMethod.Post, "https://api.mistral.ai/v1/chat/completions");
                request.Headers.Add("Authorization", $"Bearer {_apiKey}");
                request.Content = new StringContent(requestJson, Encoding.UTF8, "application/json");

                var response = await _httpClient.SendAsync(request);
                var jsonResponse = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError(
                        "Mistral API failed. StatusCode: {StatusCode}, Response: {Response}",
                        response.StatusCode, jsonResponse
                    );
                    return string.Empty;
                }

                using var doc = JsonDocument.Parse(jsonResponse);
                var content = doc.RootElement
                                 .GetProperty("choices")[0]
                                 .GetProperty("message")
                                 .GetProperty("content")
                                 .GetString();

                // 🔥 Successful response bhi log karo
                _logger.LogInformation("Mistral API response received: {Response}", content);

                return content ?? string.Empty;
            }
            catch (Exception ex)
            {
                // 🔥 Network down / exception case
                _logger.LogError(ex, "Mistral API call threw an exception.");
                return string.Empty;
            }
        }
    }
}
