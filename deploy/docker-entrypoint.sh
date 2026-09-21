#!/bin/sh
set -e

# Vercel PORT inject karta hai runtime per, fallback 8080
: "${PORT:=8080}"
export PORT

# Nginx ab zaroori nahi — ktechStore.Web ka apna YARP proxy hai.
# Supervisor seedha 3 processes chalayega: nextjs, admin, web
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf