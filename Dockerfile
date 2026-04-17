# --- Stage 1: Build Angular Frontend ---
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npx ng build --configuration production

# --- Stage 2: Build Django Backend ---
FROM python:3.12-slim
WORKDIR /app

# Install system dependencies & Nginx
RUN apt-get update && apt-get install -y \
    nginx \
    libpq-dev \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir gunicorn dj-database-url psycopg2-binary redis django-cors-headers
RUN pip install --no-cache-dir -r requirements.txt

# Copy Backend code
COPY backend/ ./

# Copy Frontend build from Stage 1
COPY --from=frontend-build /app/frontend/dist/frontend /usr/share/nginx/html

# nginx configuration
RUN echo 'server { \
    listen 80; \
    location /prompts/ { \
        proxy_pass http://localhost:8000; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
    } \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/sites-available/default

# Expose port (Render/Railway typically use 80 or 10000)
EXPOSE 80

# Start script
RUN echo '#!/bin/sh\n\
python manage.py migrate --noinput\n\
gunicorn config.wsgi:application --bind 0.0.0.0:8000 & \n\
nginx -g "daemon off;"' > /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]
