FROM php:apache

RUN apt-get update && apt-get install -y libpng12-dev
RUN docker-php-ext-install mbstring gd
RUN usermod -u 1000 www-data
RUN usermod -G staff www-data
