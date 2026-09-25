# =========================================================
# Stage 1: Next.js Frontend build
# =========================================================
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY Presentation/ktechStore.Web/frontend/package*.json ./
RUN npm install
COPY Presentation/ktechStore.Web/frontend/ ./
RUN npm run build

# =========================================================
# Stage 2: ktechStore.Web publish (.NET 10.0)
# =========================================================
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS web-build
WORKDIR /src
COPY . .
RUN dotnet restore Presentation/ktechStore.Web/ktechStore.Web.csproj
RUN dotnet publish Presentation/ktechStore.Web/ktechStore.Web.csproj -c Release -o /app/web /p:UseAppHost=false /p:TreatWarningsAsErrors=false

# =========================================================
# Stage 3: AdminPanelProject publish (.NET 10.0)
# =========================================================
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS admin-build
WORKDIR /src
COPY . .
# ⚠️ Apne Admin .csproj ka exact file name verify kar lein (e.g. Admin.csproj ya AdminPanelProject.csproj)
RUN dotnet restore Presentation/Admin/AspnetCoreMvcFull.csproj
RUN dotnet publish Presentation/Admin/AspnetCoreMvcFull.csproj -c Release -o /app/admin /p:UseAppHost=false /p:TreatWarningsAsErrors=false


# =========================================================
# Stage 4: Final runtime image (.NET 10.0)
# =========================================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview
WORKDIR /app

RUN apt-get update && \
    apt-get install -y curl gnupg ca-certificates supervisor dos2unix && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

COPY --from=web-build /app/web ./web
COPY --from=admin-build /app/admin ./admin

COPY --from=frontend-build /frontend/.next/standalone ./frontend
COPY --from=frontend-build /frontend/.next/static ./frontend/.next/static
COPY --from=frontend-build /frontend/public ./frontend/public

COPY Presentation/ktechStore.Web/appsettings.Production.json ./web/appsettings.Production.json
COPY deploy/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY deploy/docker-entrypoint.sh /docker-entrypoint.sh

RUN dos2unix /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]