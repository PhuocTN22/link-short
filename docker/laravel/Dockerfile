# docker/laravel/Dockerfile
FROM php:8.2-fpm-alpine

# -----------------------------
# Runtime libs
# -----------------------------
RUN apk add --no-cache \
    icu-libs icu-data-full \
    libpq \
    libzip \
    oniguruma \
    curl

# -----------------------------
# Build deps + PHP extensions + phpredis
# -----------------------------
RUN set -eux; \
    apk add --no-cache --virtual .build-deps \
      $PHPIZE_DEPS \
      icu-dev \
      postgresql-dev \
      zlib-dev \
      libzip-dev \
      oniguruma-dev; \
    docker-php-ext-configure intl; \
    docker-php-ext-install -j"$(nproc)" intl pdo_pgsql opcache mbstring zip; \
    pecl install redis; \
    docker-php-ext-enable redis; \
    rm -rf /tmp/pear; \
    apk del .build-deps

# -----------------------------
# Opcache
# -----------------------------
RUN { \
  echo 'opcache.enable=1'; \
  echo 'opcache.enable_cli=1'; \
  echo 'opcache.validate_timestamps=0'; \
  echo 'opcache.jit=1255'; \
  echo 'opcache.jit_buffer_size=128M'; \
} > /usr/local/etc/php/conf.d/opcache.ini

WORKDIR /var/www/html

# -----------------------------
# Composer
# -----------------------------
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# -----------------------------
# 1) Dùng cache cho composer: cài VENDOR trước (chưa có code)
#    => PHẢI --no-scripts để tránh gọi artisan khi chưa tồn tại
# -----------------------------
# nếu project của bạn nằm ở "backend/backend", hãy đổi 2 dòng COPY cho đúng path
COPY ./backend/composer.json ./backend/composer.lock ./
RUN set -eux; \
    composer install --no-dev --no-interaction --prefer-dist --no-progress --no-scripts; \
    rm -rf /root/.composer/cache

# -----------------------------
# 2) Copy toàn bộ source
# -----------------------------
COPY ./backend /var/www/html

# Đồng bộ vendor (vẫn --no-scripts để build ổn định), rồi discover package thủ công
RUN set -eux; \
    composer install --no-dev --no-interaction --prefer-dist --no-progress --no-scripts; \
    composer dump-autoload -o; \
    php artisan package:discover --ansi || true

# Quyền ghi cho runtime
RUN chown -R www-data:www-data storage bootstrap/cache

USER www-data

EXPOSE 9000
CMD ["php-fpm"]
