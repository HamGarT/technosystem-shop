FROM php:8.3-fpm-alpine

WORKDIR /var/www/html

# Instalar dependencias del sistema
RUN apk update \
    && apk add --no-cache \
        git \
        curl \
        postgresql-dev \
        zip \
        unzip \
    && docker-php-ext-install pdo pdo_pgsql

# Copiar Composer desde imagen oficial
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar archivos de la aplicación
COPY . .

# Instalar dependencias de PHP
RUN composer install --no-interaction --optimize-autoloader

# Exponer puerto
EXPOSE 8000

# Comando para iniciar servidor Laravel con migraciones
CMD ["sh", "-c", "php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8000"]
