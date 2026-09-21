#!/bin/sh
set -e

# Fallback port (Koyeb: 8000 tha, Vercel: 8080 expect karta hai — Vercel Project
# Settings mein PORT=8080 explicitly set karna, warna 502 aayega)
: "${PORT:=8080}"
export PORT

# nginx.conf.template ke andar ${PORT} ko actual value se replace karo
envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Supervisor start karo — yeh web, admin, aur nginx teeno ko chalayega
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
