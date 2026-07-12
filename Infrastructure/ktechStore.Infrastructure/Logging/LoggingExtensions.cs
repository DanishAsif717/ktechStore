using Microsoft.Extensions.Hosting;
using Serilog;


namespace ktechStore.Infrastructure.Logging
{
    public static class LoggingExtensions
    {
        public static IHostBuilder AddSharedLogging(this IHostBuilder hostBuilder, string appName)
        {
            hostBuilder.UseSerilog((context, services, configuration) =>
            {
                configuration
                    .WriteTo.Console()
                    .WriteTo.File(
                        path: $"Logs/{appName}/log-.txt",       
                        rollingInterval: RollingInterval.Day,
                        retainedFileCountLimit: 7,     
                        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss} [{Level}] {SourceContext}: {Message}{NewLine}{Exception}"
                    );
            });

            return hostBuilder;
        }
    }
}
