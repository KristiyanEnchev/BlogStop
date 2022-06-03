namespace Application.Common
{
    using System.Text.Json;
    using System.Text.Json.Serialization;

    public static class JsonSerializerOptionsProvider
    {
        public static JsonSerializerOptions CreateDefaultOptions()
        {
            return new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
                Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) }
            };
        }
    }
}
