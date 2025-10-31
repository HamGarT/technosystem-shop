#!/bin/sh
set -e

# Ejecutar migraciones
php artisan migrate --force

# Iniciar servidor Laravel
php artisan serve --host=0.0.0.0 --port=8000
