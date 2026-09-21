# =========================================================
# Stage 1: Next.js Frontend build (SSR / standalone mode)
# =========================================================
# ⚠️ ZAROORI: next.config.js mein "output: 'standalone'" set hona chahiye,
# warna .next/standalone folder generate hi nahi hogi.
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY ktechStore.Web/Frontend/package*.json ./
RUN npm install
COPY ktechStore.Web/Frontend/ ./
RUN npm run build

# =========================================================
# Stage 2: ktechStore.Web publish (poore repo context ke saath)
# =========================================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS web-build
WORKDIR /src
COPY . .
# ⚠️ Apne .csproj ka exact naam/path check kar lena
RUN dotnet publish ktechStore.Web/ktechStore.Web.csproj -c Release -o /app/web /p:UseAppHost=false

# =========================================================
# Stage 3: AdminPanelProject publish
# =========================================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS admin-build
WORKDIR /src
COPY . .
# ⚠️ Apne .csproj ka exact naam/path check kar lena
RUN dotnet publish AdminPanelProject/AdminPanelProject.csproj -c Release -o /app/admin /p:UseAppHost=false

# =========================================================
# Stage 4: Final runtime image (Web + Admin + Next.js + Supervisor)
# =========================================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

# Node.js (Next.js server chalane ke liye) + Supervisor install karo
RUN apt-get update && \
    apt-get install -y curl gnupg ca-certificates supervisor && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# .NET apps copy karo
COPY --from=web-build /app/web ./web
COPY --from=admin-build /app/admin ./admin

# Next.js standalone output copy karo (server.js + minimal node_modules)
COPY --from=frontend-build /frontend/.next/standalone ./frontend
COPY --from=frontend-build /frontend/.next/static ./frontend/.next/static
COPY --from=frontend-build /frontend/public ./frontend/public

# ktechStore.Web ka production override (container ke internal addresses)
COPY appsettings.Production.json ./web/appsettings.Production.json

# Supervisor config aur entrypoint copy karo
COPY deploy/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY deploy/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]