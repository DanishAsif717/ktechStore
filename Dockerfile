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
# Stage 2: Admin Panel Frontend Assets build (Gulp/Node)
# =========================================================
FROM node:20 AS admin-assets-build
WORKDIR /admin-src
COPY Presentation/Admin/package*.json ./
RUN npm install --legacy-peer-deps
COPY Presentation/Admin/ ./
RUN npm run build:prod

# =========================================================
# Stage 3: ktechStore.Web publish (.NET 10.0)
# =========================================================
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS web-build
WORKDIR /src
COPY . .
RUN mkdir -p ktechStore && echo "{}" > ktechStore/sharedsettings.json
RUN dotnet restore Presentation/ktechStore.Web/ktechStore.Web.csproj
RUN dotnet publish Presentation/ktechStore.Web/ktechStore.Web.csproj -c Release -o /app/web /p:UseAppHost=false /p:TreatWarningsAsErrors=false

# =========================================================
# Stage 4: AdminPanelProject publish (.NET 10.0)
# =========================================================
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS admin-build
WORKDIR /src
COPY . .
# ⚠️ Apne Admin .csproj ka exact file name verify kar lein (e.g. Admin.csproj ya AdminPanelProject.csproj)
COPY --from=admin-assets-build /admin-src/wwwroot ./Presentation/Admin/wwwroot
RUN dotnet restore Presentation/Admin/AspnetCoreMvcFull.csproj
RUN dotnet publish Presentation/Admin/AspnetCoreMvcFull.csproj -c Release -o /app/admin /p:UseAppHost=false /p:TreatWarningsAsErrors=false

# =========================================================
# Stage 5: Final runtime image (.NET 10.0)
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